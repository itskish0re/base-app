import { toast as sonnerToast, type ExternalToast } from 'sonner';

/** Show toast notifications from anywhere in the app. Requires `<Toaster />` in providers. */
export const toast = sonnerToast;

export function toastSuccess(message: string, options?: ExternalToast) {
  return sonnerToast.success(message, options);
}

export function toastError(message: string, options?: ExternalToast) {
  return sonnerToast.error(message, options);
}

export function toastInfo(message: string, options?: ExternalToast) {
  return sonnerToast.info(message, options);
}

export function toastWarning(message: string, options?: ExternalToast) {
  return sonnerToast.warning(message, options);
}

export function toastLoading(message: string, options?: ExternalToast) {
  return sonnerToast.loading(message, options);
}

export function toastPromise<T>(
  promise: Promise<T> | (() => Promise<T>),
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  },
) {
  return sonnerToast.promise(promise, messages);
}
