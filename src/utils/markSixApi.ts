/**
 * Mark Six API utilities
 * Calculate draw dates and numbers based on schedule
 */

export interface DrawInfo {
  drawNumber: string;
  drawDate: Date;
  dayOfWeek: string;
}

export interface MarkSixDrawDates {
  previousDraw: DrawInfo | null;
  nextDraw: DrawInfo | null;
}

export interface TenetDrawData {
  nextDraw: string;
  nextDrawDate: string;
  lastDraw: string;
  lastDrawDate: string;
  lastUpdated: string;
}

/**
 * Fetch latest Mark Six draw info from Tenet Concept API
 */
export const fetchTenetDrawData = async (): Promise<TenetDrawData | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://m6r.tenetconcept.com/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched Tenet draw data:', data);
    
    return {
      nextDraw: data.nextDraw,
      nextDrawDate: data.nextDrawDate,
      lastDraw: data.lastDraw,
      lastDrawDate: data.lastDrawDate,
      lastUpdated: data.lastUpdated,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Tenet API timeout after 5 seconds');
      } else {
        console.error('Error fetching from Tenet API:', error.message);
      }
    } else {
      console.error('Error fetching Tenet draw data:', error);
    }
    return null;
  }
};

/**
 * Parse Tenet date string to Date object
 * Format: "Sat, 10 Jan 2026" or "08 Jan 2026"
 */
const parseTenetDate = (dateStr: string): Date | null => {
  try {
    // Remove day of week if present
    const cleanDateStr = dateStr.replace(/^[A-Za-z]+,\s*/, '');
    
    // Parse "DD MMM YYYY"
    const parts = cleanDateStr.split(' ');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0]);
    const monthStr = parts[1];
    const year = parseInt(parts[2]);
    
    const monthMap: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    const month = monthMap[monthStr];
    if (month === undefined) return null;
    
    return new Date(year, month, day);
  } catch (error) {
    console.error('Error parsing Tenet date:', dateStr, error);
    return null;
  }
};

/**
 * Get day of week name in Chinese
 */
const getDayOfWeekChinese = (date: Date): string => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `星期${days[date.getDay()]}`;
};

/**
 * Fetch Mark Six draw dates using Tenet API as primary source
 */
export const fetchMarkSixDrawDates = async (): Promise<MarkSixDrawDates> => {
  // Try Tenet API first
  const tenetData = await fetchTenetDrawData();
  
  if (tenetData) {
    const lastDrawDate = parseTenetDate(tenetData.lastDrawDate);
    const nextDrawDate = parseTenetDate(tenetData.nextDrawDate);
    
    const previousDraw: DrawInfo | null = lastDrawDate ? {
      drawNumber: tenetData.lastDraw,
      drawDate: lastDrawDate,
      dayOfWeek: getDayOfWeekChinese(lastDrawDate),
    } : null;
    
    const nextDraw: DrawInfo | null = nextDrawDate ? {
      drawNumber: tenetData.nextDraw,
      drawDate: nextDrawDate,
      dayOfWeek: getDayOfWeekChinese(nextDrawDate),
    } : null;
    
    console.log('Parsed Tenet draw data:', { previousDraw, nextDraw });
    return { previousDraw, nextDraw };
  }
  
  // Fallback to system date calculation if Tenet API fails
  console.log('Tenet API failed, using system date fallback');
  const now = new Date();
  const nextDrawDate = getNextDrawDateFallback(now);
  const prevDrawDate = getPreviousDrawDateFallback(now);
  
  return {
    previousDraw: {
      drawNumber: calculateDrawNumber(prevDrawDate),
      drawDate: prevDrawDate,
      dayOfWeek: getDayOfWeekChinese(prevDrawDate),
    },
    nextDraw: {
      drawNumber: calculateDrawNumber(nextDrawDate),
      drawDate: nextDrawDate,
      dayOfWeek: getDayOfWeekChinese(nextDrawDate),
    },
  };
};

/**
 * Calculate Mark Six draw number based on date
 * Mark Six typically has 3 draws per week (Tue, Thu, Sat)
 * Draw number format: YY/NNN (e.g., 26/002 = 2026年第2期)
 */
const calculateDrawNumber = (date: Date): string => {
  const year = date.getFullYear();
  const yearShort = year.toString().substring(2, 4); // Get last 2 digits
  
  // Start of year
  const startOfYear = new Date(year, 0, 1);
  
  // Count number of draw days (Tue/Thu/Sat) from start of year to this date
  let drawCount = 0;
  const currentDate = new Date(startOfYear);
  
  while (currentDate <= date) {
    const dayOfWeek = currentDate.getDay();
    // Check if it's a draw day (2=Tue, 4=Thu, 6=Sat)
    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6) {
      drawCount++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Format as YY/NNN
  const drawNumStr = drawCount.toString().padStart(3, '0');
  return `${yearShort}/${drawNumStr}`;
};

/**
 * Fetch latest Mark Six draw dates from magayo.com (fallback method)
 * This website has server-side rendered content we can parse
 */
const fetchMarkSixDrawDatesFromMagayo = async (): Promise<MarkSixDrawDates> => {
  try {
    // Create AbortController for 5 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://www.magayo.com/lotto/hong-kong/mark-six-results/', {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    console.log('Fetched magayo HTML, length:', html.length);

    // Parse last draw - "3 January 2026 (Saturday)"
    const lastDrawDateMatch = html.match(/Latest Mark Six Results.*?(\d+)\s+(\w+)\s+(\d{4})\s*\((\w+)\)/s);

    // Parse next draw - "6 January 2026 (Tuesday)"
    const nextDrawDateMatch = html.match(/Next Mark Six Jackpot.*?(\d+)\s+(\w+)\s+(\d{4})\s*\((\w+)\)/s);
    
    console.log('Regex matches:', {
      lastDrawDate: lastDrawDateMatch ? `${lastDrawDateMatch[1]} ${lastDrawDateMatch[2]} ${lastDrawDateMatch[3]}` : null,
      lastDayOfWeek: lastDrawDateMatch?.[4],
      nextDrawDate: nextDrawDateMatch ? `${nextDrawDateMatch[1]} ${nextDrawDateMatch[2]} ${nextDrawDateMatch[3]}` : null,
      nextDayOfWeek: nextDrawDateMatch?.[4],
    });

    let previousDraw: DrawInfo | null = null;
    let nextDraw: DrawInfo | null = null;

    // Parse last draw
    if (lastDrawDateMatch) {
      const day = parseInt(lastDrawDateMatch[1]);
      const monthStr = lastDrawDateMatch[2]; // "January", "February", etc.
      const year = parseInt(lastDrawDateMatch[3]);
      
      // Convert month name to number
      const monthMap: { [key: string]: number } = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
      };
      const month = monthMap[monthStr];
      
      const date = new Date(year, month, day);
      previousDraw = {
        drawNumber: calculateDrawNumber(date),
        drawDate: date,
        dayOfWeek: getDayOfWeekChinese(date),
      };
    }

    // Parse next draw
    if (nextDrawDateMatch) {
      const day = parseInt(nextDrawDateMatch[1]);
      const monthStr = nextDrawDateMatch[2];
      const year = parseInt(nextDrawDateMatch[3]);
      
      const monthMap: { [key: string]: number } = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
      };
      const month = monthMap[monthStr];
      
      const date = new Date(year, month, day);
      nextDraw = {
        drawNumber: calculateDrawNumber(date),
        drawDate: date,
        dayOfWeek: getDayOfWeekChinese(date),
      };
    }

    console.log('Parsed draw data:', { previousDraw, nextDraw });
    return { previousDraw, nextDraw };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Fetch timeout after 5 seconds');
      } else {
        console.error('Error fetching from magayo:', error.message);
      }
    } else {
      console.error('Error fetching draw dates:', error);
    }
    // Return null values if fetch fails
    return { previousDraw: null, nextDraw: null };
  }
};

/**
 * Calculate next draw date based on standard schedule
 * Mark Six draws are typically on Tuesday, Thursday, and Saturday
 * Fallback method if API fetch fails
 */
export const getNextDrawDateFallback = (fromDate: Date = new Date()): Date => {
  const date = new Date(fromDate);
  date.setHours(21, 30, 0, 0); // Draw time is 21:30

  // Days when draws happen: 2 (Tue), 4 (Thu), 6 (Sat)
  const drawDays = [2, 4, 6];
  
  let daysToAdd = 1;
  let found = false;
  
  // Find next draw day
  while (!found && daysToAdd <= 7) {
    const testDate = new Date(date);
    testDate.setDate(date.getDate() + daysToAdd);
    
    if (drawDays.includes(testDate.getDay())) {
      found = true;
      return testDate;
    }
    
    daysToAdd++;
  }
  
  // Fallback: return tomorrow
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);
  return tomorrow;
};

/**
 * Get previous draw date based on standard schedule
 * Fallback method if API fetch fails
 */
export const getPreviousDrawDateFallback = (fromDate: Date = new Date()): Date => {
  const date = new Date(fromDate);
  date.setHours(21, 30, 0, 0);

  // Days when draws happen: 2 (Tue), 4 (Thu), 6 (Sat)
  const drawDays = [2, 4, 6];
  
  let daysToSubtract = 1;
  let found = false;
  
  // Find previous draw day
  while (!found && daysToSubtract <= 7) {
    const testDate = new Date(date);
    testDate.setDate(date.getDate() - daysToSubtract);
    
    if (drawDays.includes(testDate.getDay())) {
      found = true;
      return testDate;
    }
    
    daysToSubtract++;
  }
  
  // Fallback: return yesterday
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  return yesterday;
};
