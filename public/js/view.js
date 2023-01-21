//確認密碼輸入皆為相同
function impairedPassword(P1, P2) {
  if(P1.length!==P2.length)return true;
  for (let i = 0; i < P1.length; i++) {
    if (P1[i] !== P2[i]) {
      return true;
    }
  }
  return false;
}



const note = document.querySelector('.note');
const register = document.querySelector('.register');
register.addEventListener('submit', function (event) {
  event.preventDefault();
  const confirmPassword = document.querySelector('#confirmPassword');
  const password = document.querySelector('#password');
  
  if (!(password.value && confirmPassword.value)) {
    note.textContent = '請輸入密碼及確認密碼';
  } else if (impairedPassword(confirmPassword.value, password.value)) {
    note.textContent = '請確認兩次輸入密碼相同';
  } else {
    register.submit();
  }
});


;