const User = require('../model/User');
const UserRole = require('../model/UserRole');
const { generateToken, validateToken } = require('../config/jwtUtils');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email et mot de passe requis" });
    }

    const user = await User.findOne({ email: email.toUpperCase().trim() });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const validPassword = await user.matchPassword(password);
    if (!validPassword) return res.status(401).json({ message: "Mot de passe incorrect" });

    const payload = {
        id: user._id,
        email: user.email
    };

    const accessToken = generateToken(payload, '15m');
    const refreshToken = generateToken(payload, '7d');

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000 
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/api/auth/refresh-token',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ 
        message: "Connexion réussie", 
        user: { 
            id: user._id,
            email: user.email,
            nom: user.nom,
            isTempPassword: user.isPasswordTemp || false
        }
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(403).json({ message: "Refresh token manquant", isAuthError: true });
    }

    let decoded;
    try {
      decoded = validateToken(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Refresh token invalide ou expiré", isAuthError: true });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });


    const payload = {
        id: user._id,
        email: user.email
    };

    const newAccessToken = generateToken(payload, '15m');
    const refreshToken = generateToken(payload, '7d');

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/api/auth/refresh-token',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Nouveau token généré",
      user: {
        id: user._id
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du renouvellement du token", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/api/auth/refresh-token'
    });

    return res.json({ message: "Déconnexion réussie" });

  } catch (error) {
    return res.status(500).json({ message: "Erreur lors du logout" });
  }
};

module.exports = { login, refreshToken, logout };