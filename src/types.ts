export  type CodeType = 
  | 'url' 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'wifi' 
  | 'location' 
  | 'vcard'
  | 'code128'
  | 'ean13'
  | 'upc'
  | 'code39';

export interface QRCodeOptions {
  value: string;
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  bgColor: string;
  fgColor: string;
  includeMargin: boolean;
}

export interface BarcodeOptions {
  value: string;
  format: 'CODE128' | 'EAN13' | 'UPC' | 'CODE39';
  width?: number;
  height?: number;
  displayValue?: boolean;
  background?: string;
  lineColor?: string;
  margin?: number;
  fontSize?: number;
  textMargin?: number;
}
 