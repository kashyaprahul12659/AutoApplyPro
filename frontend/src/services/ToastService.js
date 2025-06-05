import { toast } from 'react-toastify';

/**
 * Centralized toast notification service
 * Use this service for all toast notifications to ensure consistent styling
 */
class ToastService {
  constructor() {
    // Default options for all toast notifications
    this.defaultOptions = {
      position: window.innerWidth < 768 ? 'bottom-center' : 'top-right', // Mobile-friendly positioning
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      // Default styling
      style: {
        fontSize: '14px',
        fontWeight: 500,
        borderRadius: '8px',
      },
      // Improved accessibility
      role: 'alert',
      theme: 'colored',
    };
    
    // Listen for window resize to update position for mobile
    window.addEventListener('resize', this.updatePositionForMobile.bind(this));
  }
  
  /**
   * Update toast position based on screen size
   */
  updatePositionForMobile() {
    this.defaultOptions.position = window.innerWidth < 768 ? 'bottom-center' : 'top-right';
  }
  
  /**
   * Show success toast notification
   * @param {string} message - Message to display
   * @param {Object} options - Toast configuration options
   */
  success(message, options = {}) {
    if (!message) return; // Skip if no message
    toast.success(message, {
      ...this.defaultOptions,
      icon: '✅',
      autoClose: 3000,
      ...options
    });
  }

  /**
   * Show error toast notification
   * @param {string} message - Message to display
   * @param {Object} options - Toast configuration options
   */
  error(message, options = {}) {
    if (!message) return; // Skip if no message
    toast.error(message || 'An error occurred', {
      ...this.defaultOptions,
      icon: '❌',
      autoClose: 5000, // Errors stay longer
      ...options
    });
  }

  /**
   * Show info toast notification
   * @param {string} message - Message to display
   * @param {Object} options - Toast configuration options
   */
  info(message, options = {}) {
    if (!message) return; // Skip if no message
    toast.info(message, {
      ...this.defaultOptions,
      icon: 'ℹ️',
      ...options
    });
  }

  /**
   * Show warning toast notification
   * @param {string} message - Message to display
   * @param {Object} options - Toast configuration options
   */
  warning(message, options = {}) {
    if (!message) return; // Skip if no message
    toast.warning(message, {
      ...this.defaultOptions,
      icon: '⚠️',
      autoClose: 4000,
      ...options
    });
  }
  
  /**
   * Show loading toast notification that can be updated later
   * @param {string} message - Message to display
   * @param {Object} options - Toast configuration options
   * @returns {string} Toast ID for updating later
   */
  loading(message = 'Loading...', options = {}) {
    return toast.loading(message, {
      ...this.defaultOptions,
      autoClose: false, // Don't auto close loading toasts
      closeButton: false,
      ...options
    });
  }
  
  /**
   * Update an existing toast (useful for loading -> success flows)
   * @param {string} toastId - ID of toast to update
   * @param {Object} options - New toast options
   */
  update(toastId, options = {}) {
    if (!toastId) return;
    toast.update(toastId, {
      ...options,
      render: options.message || options.render,
    });
  }
  
  /**
   * Dismiss all toasts
   */
  dismissAll() {
    toast.dismiss();
  }
  
  /**
   * Dismiss a specific toast
   * @param {string} toastId - ID of toast to dismiss
   */
  dismiss(toastId) {
    if (toastId) {
      toast.dismiss(toastId);
    }
  }
}

// Export as singleton
export default new ToastService();
