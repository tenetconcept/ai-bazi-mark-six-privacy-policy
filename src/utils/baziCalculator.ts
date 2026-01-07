import { Solar, Lunar } from 'lunar-typescript';

// Heavenly Stems (天干)
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// Earthly Branches (地支)
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Five Elements (五行)
export const FIVE_ELEMENTS = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
  '子': '水', '丑': '土',
  '寅': '木', '卯': '木',
  '辰': '土', '巳': '火',
  '午': '火', '未': '土',
  '申': '金', '酉': '金',
  '戌': '土', '亥': '水',
};

// Element to numbers mapping for lucky number generation
export const ELEMENT_NUMBERS: Record<string, number[]> = {
  '木': [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
  '火': [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],
  '土': [5, 10, 15, 20, 25, 30, 35, 40, 45],
  '金': [4, 9, 14, 19, 24, 29, 34, 39, 44, 49],
  '水': [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
};

// Lucky colors for each element
export const ELEMENT_COLORS: Record<string, string[]> = {
  '木': ['green', 'blue'],
  '火': ['red', 'orange', 'purple'],
  '土': ['yellow', 'brown', 'beige'],
  '金': ['white', 'gold', 'silver'],
  '水': ['black', 'blue', 'grey'],
};

// Lucky directions for each element
export const ELEMENT_DIRECTIONS: Record<string, string> = {
  '木': '東',
  '火': '南',
  '土': '中',
  '金': '西',
  '水': '北',
};

export interface BaziResult {
  yearPillar: { stem: string; branch: string };
  monthPillar: { stem: string; branch: string };
  dayPillar: { stem: string; branch: string };
  hourPillar: { stem: string; branch: string };
  elements: Record<string, number>;
  dominantElement: string;
  luckyNumbers: number[];
  specialNumber: number;
  luckyColor: string;
  luckyDirection: string;
}

// Get the Chinese hour (時辰) from hour of day
export const getChineseHour = (hour: number): number => {
  // 子時 starts at 23:00
  if (hour >= 23 || hour < 1) return 0; // 子
  return Math.floor((hour + 1) / 2);
};

// Calculate Bazi from birth date and time
export const calculateBazi = (
  year: number,
  month: number,
  day: number,
  hour: number
): BaziResult => {
  try {
    // Create Solar date
    const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
    const lunar = solar.getLunar();
    const bazi = lunar.getEightChar();
    
    // Get the four pillars
    const yearPillar = {
      stem: bazi.getYearGan(),
      branch: bazi.getYearZhi(),
    };
    
    const monthPillar = {
      stem: bazi.getMonthGan(),
      branch: bazi.getMonthZhi(),
    };
    
    const dayPillar = {
      stem: bazi.getDayGan(),
      branch: bazi.getDayZhi(),
    };
    
    const hourPillar = {
      stem: bazi.getTimeGan(),
      branch: bazi.getTimeZhi(),
    };
    
    // Calculate element distribution
    const elements: Record<string, number> = {
      '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    };
    
    const allChars = [
      yearPillar.stem, yearPillar.branch,
      monthPillar.stem, monthPillar.branch,
      dayPillar.stem, dayPillar.branch,
      hourPillar.stem, hourPillar.branch,
    ];
    
    allChars.forEach(char => {
      const element = FIVE_ELEMENTS[char as keyof typeof FIVE_ELEMENTS];
      if (element) {
        elements[element]++;
      }
    });
    
    // Find dominant element
    let dominantElement = '木';
    let maxCount = 0;
    Object.entries(elements).forEach(([element, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantElement = element;
      }
    });
    
    // Generate lucky numbers based on elements
    const luckyNumbers = generateLuckyNumbers(elements, dominantElement, dayPillar);
    const specialNumber = generateSpecialNumber(elements, dominantElement, hourPillar);
    
    // Get lucky color and direction
    const luckyColor = ELEMENT_COLORS[dominantElement][0];
    const luckyDirection = ELEMENT_DIRECTIONS[dominantElement];
    
    return {
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      elements,
      dominantElement,
      luckyNumbers,
      specialNumber,
      luckyColor,
      luckyDirection,
    };
  } catch (error) {
    console.error('Error calculating Bazi:', error);
    // Return default values on error
    return getDefaultBaziResult();
  }
};

// Generate 6 lucky numbers based on Bazi elements
const generateLuckyNumbers = (
  elements: Record<string, number>,
  dominantElement: string,
  dayPillar: { stem: string; branch: string }
): number[] => {
  const numbers: Set<number> = new Set();
  
  // Get numbers from dominant element
  const dominantNumbers = ELEMENT_NUMBERS[dominantElement];
  
  // Add numbers from dominant element
  while (numbers.size < 3 && dominantNumbers.length > 0) {
    const randomIndex = Math.floor(Math.random() * dominantNumbers.length);
    const num = dominantNumbers[randomIndex];
    if (num >= 1 && num <= 49) {
      numbers.add(num);
    }
  }
  
  // Add numbers from other elements based on their count
  const sortedElements = Object.entries(elements)
    .filter(([el]) => el !== dominantElement)
    .sort(([, a], [, b]) => b - a);
  
  for (const [element] of sortedElements) {
    if (numbers.size >= 6) break;
    const elementNumbers = ELEMENT_NUMBERS[element];
    const randomIndex = Math.floor(Math.random() * elementNumbers.length);
    const num = elementNumbers[randomIndex];
    if (num >= 1 && num <= 49 && !numbers.has(num)) {
      numbers.add(num);
    }
  }
  
  // Fill remaining with random numbers if needed
  while (numbers.size < 6) {
    const randomNum = Math.floor(Math.random() * 49) + 1;
    numbers.add(randomNum);
  }
  
  return Array.from(numbers).sort((a, b) => a - b);
};

// Generate special number based on hour pillar
const generateSpecialNumber = (
  elements: Record<string, number>,
  dominantElement: string,
  hourPillar: { stem: string; branch: string }
): number => {
  const hourElement = FIVE_ELEMENTS[hourPillar.branch as keyof typeof FIVE_ELEMENTS];
  const possibleNumbers = ELEMENT_NUMBERS[hourElement || dominantElement];
  const randomIndex = Math.floor(Math.random() * possibleNumbers.length);
  return possibleNumbers[randomIndex];
};

// Get default Bazi result for error cases
const getDefaultBaziResult = (): BaziResult => {
  return {
    yearPillar: { stem: '甲', branch: '子' },
    monthPillar: { stem: '甲', branch: '子' },
    dayPillar: { stem: '甲', branch: '子' },
    hourPillar: { stem: '甲', branch: '子' },
    elements: { '木': 2, '火': 0, '土': 0, '金': 0, '水': 6 },
    dominantElement: '水',
    luckyNumbers: [1, 11, 21, 31, 41, 46],
    specialNumber: 6,
    luckyColor: 'black',
    luckyDirection: '北',
  };
};

// Calculate name numerology
export const calculateNameNumerology = (name: string): number => {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  // Reduce to single digit or master number
  while (sum > 49) {
    sum = Math.floor(sum / 10) + (sum % 10);
  }
  return sum || 1;
};

// Get suggested purchase location based on elements and birth place
export const getSuggestedLocation = (
  dominantElement: string,
  birthPlace: string,
  locations: string[]
): string => {
  if (!locations || locations.length === 0) {
    return '';
  }
  
  // Use element to determine location index
  const elementIndex = Object.keys(FIVE_ELEMENTS).indexOf(dominantElement);
  const locationIndex = elementIndex % locations.length;
  
  return locations[locationIndex] || locations[0];
};
