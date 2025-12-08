import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Camera,
  CameraOff,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Smartphone
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";

const Scanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const scannerRef = useRef(null);
  const containerRef = useRef(null);

  const startScanner = async () => {
    try {
      setError(null);
      setScannedResult(null);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await scannerRef.current.start(
        { facingMode },
        config,
        (decodedText) => handleScanSuccess(decodedText),
        () => { }
      );

      setIsScanning(true);
      setHasPermission(true);
    } catch (err) {
      console.error("Scanner error:", err);
      setHasPermission(false);
      if (err.message && err.message.includes("Permission")) {
        setError("Camera permission denied. Please allow camera access to scan QR codes.");
      } else {
        setError("Unable to access camera. Please check your device settings.");
      }
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
      setIsScanning(false);
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };

  const handleScanSuccess = async (decodedText) => {
    await stopScanner();
    setScannedResult(decodedText);

    if (decodedText.includes("/menu")) {
      toast.success("QR Code scanned successfully!");
      const url = new URL(decodedText);
      const tableParam = url.searchParams.get("table");
      setTimeout(() => {
        if (tableParam) {
          navigate(`/menu?table=${tableParam}`);
        } else {
          navigate("/menu");
        }
      }, 1500);
    } else {
      toast.info("QR Code detected", { description: "Redirecting to menu..." });
      setTimeout(() => navigate("/menu"), 1500);
    }
  };

  const toggleCamera = async () => {
    await stopScanner();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
    setTimeout(() => startScanner(), 500);
  };

  const resetScanner = () => {
    setScannedResult(null);
    setError(null);
    startScanner();
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 sm:h-16">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="font-display font-bold text-lg">Scan QR Code</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md mx-auto">
          <div ref={containerRef} className="relative bg-card rounded-3xl overflow-hidden shadow-elevated border border-border">

            <div className="aspect-square relative">
              {!isScanning && !scannedResult && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl gradient-primary flex items-center justify-center mb-6 animate-pulse-glow">
                    <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold mb-2">Scan Table QR</h2>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    Point your camera at the QR code on your table to view the menu
                  </p>
                  {error && (
                    <div className="bg-destructive/10 text-destructive rounded-xl p-4 mb-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm text-left">{error}</p>
                    </div>
                  )}
                  <Button onClick={startScanner} size="lg" className="w-full">
                    <Camera className="w-5 h-5 mr-2" />
                    Open Camera
                  </Button>
                </div>
              )}

              <div id="qr-reader" className={`w-full h-full ${isScanning ? "block" : "hidden"}`} />

              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-scan" />
                  </div>
                </div>
              )}

              {scannedResult && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-card">
                  <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6 animate-scale-in">
                    <CheckCircle2 className="w-12 h-12 text-success" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold mb-2">QR Code Scanned!</h2>
                  <p className="text-muted-foreground text-sm mb-4">Redirecting to menu...</p>
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {isScanning && (
              <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-center gap-4">
                <Button variant="outline" size="icon" onClick={toggleCamera} className="w-12 h-12 rounded-full">
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button variant="destructive" onClick={stopScanner} className="px-6">
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">How it works</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Each table has a unique QR code. Scan it to instantly access the digital menu with exclusive offers and easy ordering.
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Having trouble scanning?</p>
              <Button variant="outline" onClick={() => navigate("/menu")} className="w-full sm:w-auto">
                Browse Menu Directly
              </Button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(250px); opacity: 0.5; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 0 !important;
        }
        #qr-reader {
          border: none !important;
        }
        #qr-reader img[alt="Info icon"],
        #qr-reader img[alt="Camera based scan"],
        #qr-reader > div:first-child {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default Scanner;
