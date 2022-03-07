export const checkRepetition = (pLen: number, str: string) => {
  let res = '',
    i = 0,
    j = 0;
  for (i = 0; i < str.length; i++) {
    let repeated = true;

    for (j = 0; j < pLen && j + i + pLen < str.length; j++) {
      repeated = repeated && str.charAt(j + i) == str.charAt(j + i + pLen);
    }
    if (j < pLen) {
      repeated = false;
    }
    if (repeated) {
      i += pLen - 1;
      repeated = false;
    } else {
      res += str.charAt(i);
    }
  }
  return res;
};

export const teststrength = (password: string) => {
  let score = 0;

  //password < 6
  if (password.length < 6) {
    return 'shortPass';
  }

  //password length
  score += password.length * 4;
  score += (checkRepetition(1, password).length - password.length) * 1;
  score += (checkRepetition(2, password).length - password.length) * 1;
  score += (checkRepetition(3, password).length - password.length) * 1;
  score += (checkRepetition(4, password).length - password.length) * 1;

  //password has 3 numbers
  if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) {
    score += 5;
  }

  //password has 2 symbols
  if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
    score += 5;
  }

  //password has Upper and Lower chars
  if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
    score += 10;
  }

  //password has number and chars
  if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
    score += 15;
  }
  //
  //password has number and symbol
  if (
    password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) &&
    password.match(/([0-9])/)
  ) {
    score += 15;
  }

  //password has char and symbol
  if (
    password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) &&
    password.match(/([a-zA-Z])/)
  ) {
    score += 15;
  }

  //password is just a numbers or chars
  if (password.match(/^[A-Za-z]+$/) || password.match(/^[0-9]+$/)) {
    score = 10;
  }
  //verifying 0 < score < 100
  if (score < 0) {
    score = 0;
  }
  if (score > 100) {
    score = 100;
  }
  if (score < 34) {
    return 'badPass';
  }
  if (score < 68) {
    return 'goodPass';
  }

  return 'strongPass';
};
