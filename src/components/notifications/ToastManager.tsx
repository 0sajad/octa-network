
import React from "react";
import { toast } from "sonner";
import { useA11y } from "@/hooks/useA11y";
import { useRTLSupport } from "@/hooks/useRTLSupport";
import { X, Check, AlertTriangle, Info, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastOptions {
  title?: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  className?: string;
  showIcon?: boolean;
  onClose?: () => void;
}

const ToastIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "success":
      return <Check className="h-4 w-4" />;
    case "error":
      return <X className="h-4 w-4" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "info":
    default:
      return <Info className="h-4 w-4" />;
  }
};

/**
 * مدير الإشعارات المحسن مع دعم للغة العربية وإمكانية الوصول
 */
export const ToastManager = {
  success: (options: Omit<ToastOptions, "type">) => {
    return ToastManager.show({ ...options, type: "success" });
  },
  error: (options: Omit<ToastOptions, "type">) => {
    return ToastManager.show({ ...options, type: "error" });
  },
  warning: (options: Omit<ToastOptions, "type">) => {
    return ToastManager.show({ ...options, type: "warning" });
  },
  info: (options: Omit<ToastOptions, "type">) => {
    return ToastManager.show({ ...options, type: "info" });
  },
  
  /**
   * عرض إشعار محسن مع دعم للغة العربية وإمكانية الوصول
   */
  show: ({
    title,
    description,
    type = "info",
    duration = 5000,
    position,
    className,
    showIcon = true,
    onClose
  }: ToastOptions) => {
    // استخدام الخطافات اللازمة
    const { soundFeedback, announce } = window.A11y || { soundFeedback: false, announce: () => {} };
    const { isRTL } = window.RTLSupport || { isRTL: false };
    
    // تحديد الموضع المناسب بناءً على اتجاه اللغة
    const toastPosition = position || (isRTL ? "top-left" : "top-right");
    
    // أنماط محددة لأنواع الإشعارات
    const toastStyles: Record<string, string> = {
      success: "bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-100",
      error: "bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-100",
      warning: "bg-yellow-100 dark:bg-yellow-900 border-yellow-500 text-yellow-700 dark:text-yellow-100",
      info: "bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-100"
    };
    
    // تحديد أيقونة الإشعار
    const iconStyles: Record<string, string> = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-white",
      info: "bg-blue-500 text-white"
    };
    
    // استدعاء نظام الإشعارات
    const toastId = toast.custom(
      (id) => (
        <div
          className={cn(
            "flex w-full rounded-lg border p-4 shadow-lg",
            toastStyles[type],
            isRTL ? "flex-row-reverse text-right" : "text-left",
            className
          )}
          role="alert"
          aria-live="assertive"
        >
          {showIcon && (
            <div className={`${isRTL ? 'ml-4' : 'mr-4'} flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${iconStyles[type]}`}>
              <ToastIcon type={type} />
            </div>
          )}
          
          <div className="flex-1">
            {title && (
              <h3 className="font-medium">{title}</h3>
            )}
            {description && (
              <p className={title ? "mt-1 text-sm opacity-90" : ""}>{description}</p>
            )}
          </div>
          
          <button
            onClick={() => {
              toast.dismiss(id);
              if (onClose) onClose();
            }}
            className={`${isRTL ? 'mr-2' : 'ml-2'} inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-opacity-10 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2`}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">إغلاق</span>
          </button>
        </div>
      ),
      {
        duration,
        position: toastPosition,
        id: `toast-${Date.now()}`,
        onAutoClose: onClose
      }
    );
    
    // إعلان للقارئات الشاشة
    if (typeof announce === 'function') {
      const fullMessage = [title, description].filter(Boolean).join(": ");
      const typeTranslation = {
        success: "نجاح",
        error: "خطأ",
        warning: "تحذير",
        info: "معلومات"
      };
      
      announce(`${typeTranslation[type] || typeTranslation.info}: ${fullMessage}`, "assertive");
    }
    
    // تشغيل صوت إشعار إذا كانت ميزة الصوت مفعلة
    if (soundFeedback) {
      try {
        const audio = new Audio(`/sounds/${type}.mp3`);
        audio.volume = 0.3;
        audio.play().catch(err => console.error('فشل تشغيل الصوت:', err));
      } catch (error) {
        console.error('فشل تشغيل صوت الإشعار:', error);
      }
    }
    
    return toastId;
  }
};

// إضافة الميزات المحسنة للنافذة العالمية
if (typeof window !== "undefined") {
  window.A11y = window.A11y || {};
  window.RTLSupport = window.RTLSupport || { isRTL: false };
  
  // تصدير الوظائف للاستخدام العالمي
  window.showToast = ToastManager.show;
}

// تعريف النافذة العالمية
declare global {
  interface Window {
    A11y: {
      soundFeedback?: boolean;
      announce?: (message: string, politeness?: "polite" | "assertive") => void;
    };
    RTLSupport: {
      isRTL: boolean;
    };
    showToast: typeof ToastManager.show;
  }
}
