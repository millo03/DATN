import bcrypt from 'bcryptjs';
import User from '../../models/Auth/users'; 
import jwt from 'jsonwebtoken';


export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header
  
    if (!token) {
      console.error('Không có token');
      return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập lại.' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error('Token không hợp lệ hoặc đã hết hạn', err);
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }
      req.user = decodedToken;
      next();
    });
  };

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Tìm người dùng bằng _id được giải mã từ token
        console.log(req.user);
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });

        // So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });

        // Kiểm tra mật khẩu mới có giống mật khẩu cũ không
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) return res.status(400).json({ message: 'Mật khẩu mới không được giống mật khẩu cũ.' });

        // Mã hóa mật khẩu mới và cập nhật
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
    }
};


export const authenticateTokengdf = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header
  
    if (!token) {
      console.error('Không có token');
      return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập lại.' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error('Token không hợp lệ hoặc đã hết hạn', err);
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }
      req.user = decodedToken;
      next();
    });
  };

export const changePasswordd = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Tìm người dùng bằng _id được giải mã từ token
        console.log(req.user);
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });

        // So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });

        // Kiểm tra mật khẩu mới có giống mật khẩu cũ không
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) return res.status(400).json({ message: 'Mật khẩu mới không được giống mật khẩu cũ.' });

        // Mã hóa mật khẩu mới và cập nhật
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
    }
};


export const authenticateTokengd = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header
  
    if (!token) {
      console.error('Không có token');
      return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập lại.' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error('Token không hợp lệ hoặc đã hết hạn', err);
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }
      req.user = decodedToken;
      next();
    });
  };

export const changePasswordhj = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Tìm người dùng bằng _id được giải mã từ token
        console.log(req.user);
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });

        // So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });

        // Kiểm tra mật khẩu mới có giống mật khẩu cũ không
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) return res.status(400).json({ message: 'Mật khẩu mới không được giống mật khẩu cũ.' });

        // Mã hóa mật khẩu mới và cập nhật
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });

    }
};



export const authenticateTokenddg = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header
  
    if (!token) {
      console.error('Không có token');
      return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập lại.' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error('Token không hợp lệ hoặc đã hết hạn', err);
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }
      req.user = decodedToken;
      next();
    });
  };

export const changePasswordf = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Tìm người dùng bằng _id được giải mã từ token
        console.log(req.user);
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });

        // So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });

        // Kiểm tra mật khẩu mới có giống mật khẩu cũ không
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) return res.status(400).json({ message: 'Mật khẩu mới không được giống mật khẩu cũ.' });

        // Mã hóa mật khẩu mới và cập nhật
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
    }
};



export const authenticateTokeng = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header
  
    if (!token) {
      console.error('Không có token');
      return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập lại.' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error('Token không hợp lệ hoặc đã hết hạn', err);
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }
      req.user = decodedToken;
      next();
    });
  };

export const changePasswordn = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Tìm người dùng bằng _id được giải mã từ token
        console.log(req.user);

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });

        // So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });

        // Kiểm tra mật khẩu mới có giống mật khẩu cũ không
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) return res.status(400).json({ message: 'Mật khẩu mới không được giống mật khẩu cũ.' });

        // Mã hóa mật khẩu mới và cập nhật
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
    }
};



export const authenticateTokennnn = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header
  
    if (!token) {
      console.error('Không có token');
      return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập lại.' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error('Token không hợp lệ hoặc đã hết hạn', err);
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }
      req.user = decodedToken;
      next();
    });
  };

export const changePassworddd = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Tìm người dùng bằng _id được giải mã từ token
        console.log(req.user);
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        


        // So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });

        // Kiểm tra mật khẩu mới có giống mật khẩu cũ không
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) return res.status(400).json({ message: 'Mật khẩu mới không được giống mật khẩu cũ.' });

        // Mã hóa mật khẩu mới và cập nhật
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });

    }
};
