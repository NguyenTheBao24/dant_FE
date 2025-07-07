class LocalStorageService {
  /**
   * Lưu một giá trị vào localStorage
   * @param {string} key - Khóa để lưu trữ
   * @param {any} value - Giá trị cần lưu (có thể là object, array, string, number...)
   */
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  /**
   * Lấy giá trị từ localStorage
   * @param {string} key - Khóa cần lấy
   * @param {any} defaultValue - Giá trị mặc định nếu không tìm thấy key
   * @returns {any} Giá trị đã lưu hoặc defaultValue
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Xóa một key khỏi localStorage
   * @param {string} key - Khóa cần xóa
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  /**
   * Kiểm tra xem một key có tồn tại trong localStorage không
   * @param {string} key - Khóa cần kiểm tra
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Xóa tất cả dữ liệu trong localStorage
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Lấy tất cả keys trong localStorage
   * @returns {string[]} Mảng các keys
   */
  getAllKeys() {
    return Object.keys(localStorage);
  }

  /**
   * Lấy kích thước đã sử dụng của localStorage (tính bằng bytes)
   * @returns {number}
   */
  getSize() {
    let total = 0;
    for (let key of this.getAllKeys()) {
      total += localStorage.getItem(key).length * 2; // Mỗi ký tự trong localStorage chiếm 2 bytes
    }
    return total;
  }
}

export default new LocalStorageService(); 