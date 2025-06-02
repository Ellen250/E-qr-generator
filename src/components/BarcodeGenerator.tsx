import  { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { useReactToPrint } from 'react-to-print';
import { motion } from 'framer-motion';
import { 
  Download, 
  Copy, 
  Printer as PrinterIcon, 
  AlertCircle, 
  CheckCircle,
  Sliders,
  QrCode
} from 'lucide-react';
import { BarcodeOptions, CodeType } from '../types';

interface Props {
  codeType: CodeType;
}

const BarcodeGenerator = ({ codeType }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [barcodeOptions, setBarcodeOptions] = useState<BarcodeOptions>({
    value: '',
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true,
    background: '#FFFFFF',
    lineColor: '#000000',
    margin: 10,
    fontSize: 20,
    textMargin: 2
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<SVGSVGElement | null>(null);
  
  // Update format based on codeType
  useEffect(() => {
    switch (codeType) {
      case 'code128':
        setBarcodeOptions(prev => ({ ...prev, format: 'CODE128' }));
        break;
      case 'ean13':
        setBarcodeOptions(prev => ({ ...prev, format: 'EAN13' }));
        break;
      case 'upc':
        setBarcodeOptions(prev => ({ ...prev, format: 'UPC' }));
        break;
      case 'code39':
        setBarcodeOptions(prev => ({ ...prev, format: 'CODE39' }));
        break;
      default:
        setBarcodeOptions(prev => ({ ...prev, format: 'CODE128' }));
    }
  }, [codeType]);

  // Generate barcode whenever input or options change
  useEffect(() => {
    if (canvasRef.current) {
      try {
        const value = inputValue || 'Sample';
        JsBarcode(canvasRef.current, value, {
          format: barcodeOptions.format,
          width: barcodeOptions.width,
          height: barcodeOptions.height,
          displayValue: barcodeOptions.displayValue,
          background: barcodeOptions.background,
          lineColor: barcodeOptions.lineColor,
          margin: barcodeOptions.margin,
          fontSize: barcodeOptions.fontSize,
          textMargin: barcodeOptions.textMargin
        });
        setBarcodeOptions(prev => ({ ...prev, value }));
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [inputValue, barcodeOptions.format, barcodeOptions.width, 
      barcodeOptions.height, barcodeOptions.displayValue, 
      barcodeOptions.background, barcodeOptions.lineColor,
      barcodeOptions.margin, barcodeOptions.fontSize,
      barcodeOptions.textMargin]);

  const handlePrint = useReactToPrint({
    content: () => barcodeRef.current,
  });
  
  const downloadBarcode = () => {
    if (!inputValue) {
      showNotification('error', 'Please enter a value first');
      return;
    }
    
    const svgElement = document.querySelector('#barcode svg') as SVGSVGElement;
    if (!svgElement) return;
    
    // Convert SVG to a data URL
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Create canvas to convert SVG to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `barcode-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up
      URL.revokeObjectURL(svgUrl);
      showNotification('success', 'Barcode downloaded successfully');
    };
    
    img.src = svgUrl;
  };
  
  const copyBarcode = () => {
    if (!inputValue) {
      showNotification('error', 'Please enter a value first');
      return;
    }
    
    const svgElement = document.querySelector('#barcode svg') as SVGSVGElement;
    if (!svgElement) return;
    
    // Convert SVG to a data URL
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    
    // Create canvas to convert SVG to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob(blob => {
        if (blob) {
          // For modern browsers
          if (navigator.clipboard && navigator.clipboard.write) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item])
              .then(() => showNotification('success', 'Barcode copied to clipboard'))
              .catch(() => showNotification('error', 'Failed to copy barcode'));
          } else {
            showNotification('error', 'Your browser does not support copying images');
          }
        }
      });
    };
    
    img.src = URL.createObjectURL(svgBlob);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const getInputPlaceholder = () => {
    switch (barcodeOptions.format) {
      case 'CODE128':
        return 'Enter any text or numbers';
      case 'EAN13':
        return 'Enter exactly 12 digits (13th is calculated)';
      case 'UPC':
        return 'Enter exactly 11 digits (12th is calculated)';
      case 'CODE39':
        return 'Enter alphanumeric text (A-Z, 0-9, -, ., $, /, +, %, space)';
      default:
        return 'Enter value';
    }
  };

  const getInputPattern = () => {
    switch (barcodeOptions.format) {
      case 'EAN13':
        return '[0-9]{12}';
      case 'UPC':
        return '[0-9]{11}';
      case 'CODE39':
        return '[A-Z0-9\\-\\.\\/\\+\\$\\% ]+';
      default:
        return undefined;
    }
  };

  return (
    <div>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle size={18} className="mr-2 text-green-500" />
          ) : (
            <AlertCircle size={18} className="mr-2 text-red-500" />
          )}
          <p>{notification.message}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div>
          <div className="mb-6">
            <label htmlFor="barcode-input" className="block text-sm font-medium text-gray-700 mb-1">
              Barcode Value
            </label>
            <input
              id="barcode-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getInputPlaceholder()}
              pattern={getInputPattern()}
              className="input"
            />
            {barcodeOptions.format === 'EAN13' && (
              <p className="mt-1 text-xs text-gray-500">Must be exactly 12 digits. The 13th digit is automatically calculated.</p>
            )}
            {barcodeOptions.format === 'UPC' && (
              <p className="mt-1 text-xs text-gray-500">Must be exactly 11 digits. The 12th digit is automatically calculated.</p>
            )}
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              <Sliders size={16} className="mr-2" />
              {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          {showAdvancedOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5 mb-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                    Line Width: {barcodeOptions.width}
                  </label>
                  <input
                    id="width"
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={barcodeOptions.width}
                    onChange={(e) => setBarcodeOptions(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height: {barcodeOptions.height}px
                  </label>
                  <input
                    id="height"
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={barcodeOptions.height}
                    onChange={(e) => setBarcodeOptions(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="margin" className="block text-sm font-medium text-gray-700 mb-1">
                    Margin: {barcodeOptions.margin}px
                  </label>
                  <input
                    id="margin"
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={barcodeOptions.margin}
                    onChange={(e) => setBarcodeOptions(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size: {barcodeOptions.fontSize}px
                  </label>
                  <input
                    id="fontSize"
                    type="range"
                    min="10"
                    max="30"
                    step="2"
                    value={barcodeOptions.fontSize}
                    onChange={(e) => setBarcodeOptions(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bgColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Background Color
                  </label>
                  <div className="flex">
                    <input
                      id="bgColor"
                      type="color"
                      value={barcodeOptions.background}
                      onChange={(e) => setBarcodeOptions(prev => ({ ...prev, background: e.target.value }))}
                      className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={barcodeOptions.background}
                      onChange={(e) => setBarcodeOptions(prev => ({ ...prev, background: e.target.value }))}
                      className="input ml-2 flex-grow"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lineColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Line Color
                  </label>
                  <div className="flex">
                    <input
                      id="lineColor"
                      type="color"
                      value={barcodeOptions.lineColor}
                      onChange={(e) => setBarcodeOptions(prev => ({ ...prev, lineColor: e.target.value }))}
                      className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={barcodeOptions.lineColor}
                      onChange={(e) => setBarcodeOptions(prev => ({ ...prev, lineColor: e.target.value }))}
                      className="input ml-2 flex-grow"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="display-value"
                  name="displayValue"
                  checked={barcodeOptions.displayValue}
                  onChange={(e) => 
                    setBarcodeOptions(prev => ({
                      ...prev,
                      displayValue: e.target.checked
                    }))
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="display-value" className="ml-2 block text-sm text-gray-700">
                  Show Value Text
                </label>
              </div>
            </motion.div>
          )}
        </div>

        {/* Barcode Display */}
        <div className="flex flex-col items-center">
          <div 
            id="barcode"
            ref={barcodeRef}
            className="bg-white rounded-xl shadow-sm p-8 flex items-center justify-center"
          >
            <svg ref={canvasRef} />
          </div>

          <div className="mt-6 flex space-x-2">
            <button
              onClick={downloadBarcode}
              disabled={!inputValue}
              className="btn btn-primary flex items-center"
            >
              <Download size={18} className="mr-2" />
              Download
            </button>
            <button
              onClick={copyBarcode}
              disabled={!inputValue}
              className="btn btn-secondary flex items-center"
            >
              <Copy size={18} className="mr-2" />
              Copy
            </button>
            <button
              onClick={handlePrint}
              disabled={!inputValue}
              className="btn btn-secondary flex items-center"
            >
              <PrinterIcon size={18} className="mr-2" />
              Print
            </button>
          </div>

          {!inputValue && (
            <p className="mt-4 text-sm text-gray-500 text-center">
              Enter a value to generate a barcode
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;
 