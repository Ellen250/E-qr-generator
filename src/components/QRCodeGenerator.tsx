import  { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { motion } from 'framer-motion';
import { 
  Download, 
  Copy, 
  AlertCircle, 
  CheckCircle,
  Sliders 
} from 'lucide-react';
import { QRCodeOptions, CodeType } from '../types';

// Create custom PrinterIcon since we can't use the Printer from lucide-react
const PrinterIcon = ({ size = 18, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

interface Props {
  codeType: CodeType;
}

const QRCodeGenerator = ({ codeType }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [qrOptions, setQrOptions] = useState<QRCodeOptions>({
    value: '',
    size: 200,
    level: 'M',
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    includeMargin: true,
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  
  // Generate QR code whenever input changes
  useEffect(() => {
    let value = inputValue;
    
    // Format the value based on the code type
    switch (codeType) {
      case 'url':
        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
          value = 'https://' + value;
        }
        break;
      case 'email':
        if (value && !value.startsWith('mailto:')) {
          value = 'mailto:' + value;
        }
        break;
      case 'phone':
        if (value && !value.startsWith('tel:')) {
          value = 'tel:' + value;
        }
        break;
      case 'sms':
        if (value && !value.startsWith('sms:')) {
          value = 'sms:' + value;
        }
        break;
      case 'wifi':
        // Format: WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;;
        if (value) {
          value = `WIFI:S:${value};T:WPA;P:;`;
        }
        break;
      default:
        break;
    }
    
    setQrOptions(prev => ({ ...prev, value }));
  }, [inputValue, codeType]);

  const handlePrint = useReactToPrint({
    content: () => qrRef.current,
  });
  
  const downloadQRCode = () => {
    if (!qrOptions.value) {
      showNotification('error', 'Please enter a value first');
      return;
    }
    
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;
    
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    showNotification('success', 'QR code downloaded successfully');
  };
  
  const copyQRCode = () => {
    if (!qrOptions.value) {
      showNotification('error', 'Please enter a value first');
      return;
    }
    
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;
    
    canvas.toBlob(blob => {
      if (blob) {
        // For modern browsers
        if (navigator.clipboard && navigator.clipboard.write) {
          const item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item])
            .then(() => showNotification('success', 'QR code copied to clipboard'))
            .catch(() => showNotification('error', 'Failed to copy QR code'));
        } else {
          showNotification('error', 'Your browser does not support copying images');
        }
      }
    });
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const getInputPlaceholder = () => {
    switch (codeType) {
      case 'url':
        return 'Enter website URL (e.g., example.com)';
      case 'text':
        return 'Enter your text message';
      case 'email':
        return 'Enter email address';
      case 'phone':
        return 'Enter phone number';
      case 'sms':
        return 'Enter phone number for SMS';
      case 'location':
        return 'Enter latitude,longitude';
      case 'wifi':
        return 'Enter WiFi network name (SSID)';
      case 'vcard':
        return 'Enter contact name';
      default:
        return 'Enter value';
    }
  };

  const getInputLabel = () => {
    switch (codeType) {
      case 'url':
        return 'Website URL';
      case 'text':
        return 'Text';
      case 'email':
        return 'Email Address';
      case 'phone':
        return 'Phone Number';
      case 'sms':
        return 'SMS Number';
      case 'location':
        return 'Location (lat,long)';
      case 'wifi':
        return 'WiFi Network Name';
      case 'vcard':
        return 'Contact Name';
      default:
        return 'Value';
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
            <label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 mb-1">
              {getInputLabel()}
            </label>
            <input
              id="qr-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getInputPlaceholder()}
              className="input"
            />
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
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                  Size: {qrOptions.size}px
                </label>
                <input
                  id="size"
                  type="range"
                  min="100"
                  max="400"
                  step="10"
                  value={qrOptions.size}
                  onChange={(e) => setQrOptions(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Error Correction Level
                </label>
                <select
                  id="level"
                  value={qrOptions.level}
                  onChange={(e) => setQrOptions(prev => ({ ...prev, level: e.target.value as 'L' | 'M' | 'Q' | 'H' }))}
                  className="input"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Higher levels make QR codes more resistant to damage but increase complexity.</p>
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
                      value={qrOptions.bgColor}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, bgColor: e.target.value }))}
                      className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={qrOptions.bgColor}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, bgColor: e.target.value }))}
                      className="input ml-2 flex-grow"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="fgColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Foreground Color
                  </label>
                  <div className="flex">
                    <input
                      id="fgColor"
                      type="color"
                      value={qrOptions.fgColor}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, fgColor: e.target.value }))}
                      className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={qrOptions.fgColor}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, fgColor: e.target.value }))}
                      className="input ml-2 flex-grow"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include-margin"
                  name="includeMargin"
                  checked={qrOptions.includeMargin}
                  onChange={(e) => 
                    setQrOptions(prev => ({
                      ...prev,
                      includeMargin: e.target.checked
                    }))
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="include-margin" className="ml-2 block text-sm text-gray-700">
                  Include Margin
                </label>
              </div>
            </motion.div>
          )}
        </div>

        {/* QR Code Display */}
        <div className="flex flex-col items-center">
          <div 
            ref={qrRef}
            className={`bg-white rounded-xl shadow-sm p-8 flex items-center justify-center ${
              qrOptions.value ? 'qr-container' : ''
            }`}
          >
            <QRCodeCanvas
              id="qr-code"
              value={qrOptions.value || 'https://example.com'}
              size={qrOptions.size}
              level={qrOptions.level}
              bgColor={qrOptions.bgColor}
              fgColor={qrOptions.fgColor}
              includeMargin={qrOptions.includeMargin}
              className="rounded"
            />
          </div>

          <div className="mt-6 flex space-x-2">
            <button
              onClick={downloadQRCode}
              disabled={!qrOptions.value}
              className="btn btn-primary flex items-center"
            >
              <Download size={18} className="mr-2" />
              Download
            </button>
            <button
              onClick={copyQRCode}
              disabled={!qrOptions.value}
              className="btn btn-secondary flex items-center"
            >
              <Copy size={18} className="mr-2" />
              Copy
            </button>
            <button
              onClick={handlePrint}
              disabled={!qrOptions.value}
              className="btn btn-secondary flex items-center"
            >
              <PrinterIcon size={18} className="mr-2" />
              Print
            </button>
          </div>

          {!qrOptions.value && (
            <p className="mt-4 text-sm text-gray-500 text-center">
              Enter a value to generate a QR code
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
 