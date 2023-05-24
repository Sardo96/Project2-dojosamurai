const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

function checkAdminRole(req, res, next) {
  const user = req.session.currentUser;
  if (user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Acesso negado. Você não é um administrador.');
  }
}

function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
function calculateRemainingTime(lastGradedDate, currentBeltRank) {
  const today = new Date();
  const lastGraded = new Date(lastGradedDate);

  const waitingPeriods = {
    '9th kyu': 1,
    '8th kyu': 1,
    '7th kyu': 1,
    '6th kyu': 1,
    '5th kyu': 1,
    '4th kyu': 1,
    '3rd kyu': 1,
    '2nd kyu': 1,
    '1st kyu': 1,
    '1st dan': 1,
    '2nd dan': 2,
    '3rd dan': 3,
    '4th dan': 4,
    '5th dan': 5,
    '6th dan': 6,
    '7th dan': 7
  };

  const waitingPeriod = waitingPeriods[currentBeltRank] || 1;

  const timeDiff = today - lastGraded;

  const remainingTime = Math.max(0, waitingPeriod * 365 * 24 * 60 * 60 * 1000 - timeDiff);

  const remainingYears = Math.floor(remainingTime / (365 * 24 * 60 * 60 * 1000));
  const remainingMonths = Math.floor((remainingTime % (365 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000));
  const remainingDays = Math.floor((remainingTime % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));

  if(remainingYears === 0 && remainingMonths === 0 && remainingDays === 0){ 
    return 'Parabéns! Podes graduar caso o Sensei autorize!';
  } else {
  return `Falta(m) ${remainingYears} ano(s), ${remainingMonths} mese(s) e ${remainingDays} dia(s) para a próxima graduação!`;
  }
}

/* GET home page */
router.get('/', async (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render('index', { currentUser });
});

router.get('/profile', async (req, res, next) => {
  const currentUser = req.session.currentUser;
  const formattedLastGradedDate = formatDate(currentUser.lastGraded);
  const formattedDateOfBirth = formatDate(currentUser.dateOfBirth);
  const remainingTime = calculateRemainingTime(currentUser.lastGraded);
  const age = calculateAge(currentUser.dateOfBirth);
  res.render('profile', { currentUser, formattedLastGradedDate, age, formattedDateOfBirth, remainingTime });
});

router.get('/history', async (req, res) => {
  res.render('./history');
});
router.get('/mestres', async (req, res) => {
  res.render('./masters');
});

router.get('/horarios', requireLogin, async (req, res) => {
  res.render('./timetable');
});

router.get('/katas', requireLogin, async (req, res) => {
  const currentUser = req.session.currentUser;
  const user = await User.findById(currentUser._id);
  const belt = user.belt;
  const branco = user.belt.includes('9th Kyu');
  const amarelo = user.belt.includes('8th Kyu');
  const laranja = user.belt.includes('7th Kyu');
  const verde = user.belt.includes('6th Kyu');
  const azul = user.belt.includes('5th Kyu');
  const roxo = user.belt.includes('4th Kyu');
  const castanho3 = user.belt.includes('3rd Kyu');
  const castanho2 = user.belt.includes('2nd Kyu');
  const castanho1 = user.belt.includes('1st Kyu');
  res.render('./katas', {
    branco,
    amarelo,
    laranja,
    verde,
    azul,
    roxo,
    castanho3,
    castanho2,
    castanho1,
    belt
  });
});

router.get('/alunos', requireLogin, checkAdminRole, async (req, res) => {
  const currentUser = req.session.currentUser;
  const users = await User.find();
  res.render('./alunos', { users, currentUser });
});

router.get('/edit', async (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render('./edit', { currentUser });
});
router.post('/edit', async (req, res, next) => {
  const currentUser = req.session.currentUser;
  const { firstName, lastName, email, belt } = req.body;

  try {
    await User.findByIdAndUpdate(currentUser._id, {
      firstName,
      lastName,
      email,
      belt
    });
    req.session.currentUser.firstName = firstName;
    req.session.currentUser.lastName = lastName;
    req.session.currentUser.email = email;
    req.session.currentUser.belt = belt;
    res.redirect(`/profile/${req.query.id}`);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
