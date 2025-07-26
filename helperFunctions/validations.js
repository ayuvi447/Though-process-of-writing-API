import validator from "validator";

export const validateSignUpUser = (req) => {
  const { firstName, lastName, emailId, password, gender, age } = req.body;
  if (!firstName || !lastName || !emailId || !password || !age || !gender) {
    throw new Error("All fields are required.");
  }
  if (!validator.isAlpha(firstName) || validator.isEmpty(firstName)) {
    throw new Error("First name is not valid.");
  }
  if (!validator.isAlpha(lastName) || validator.isEmpty(lastName)) {
    throw new Error("Last name is not valid sir please check it.");
  }
  if (
  !validator.isInt(age.toString()) ||
  age < 18 ||
  age > 60
) {
  throw new Error("Age must be a valid number between 18 and 60.");
}
  if (validator.isEmail(emailId) === false) {
    throw new Error("Email is not valid.");
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 5,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 2,
      minSymbols: 1,
    })
  ) {
    throw new Error(
      "Password is not strong enough please use a strong password which could contian at least 5 characters, 1 lowercase, 1 uppercase, 2 numbers and 1 symbol.    "
    );
  }
};

export const validateSignInData=(req)=>{
    const { emailId, password} = req.body

    if(!emailId || !password){
        throw new Error('Sign value not enough please give all credentials.')
    }
}

export const validateUpdateData = (req, res)=>{
    const {firstName, lastName, gender, age} = req.body

    

    if(!validator.isAlpha(firstName) || validator.isEmpty(firstName)){
        return res.status(502).send('firstName cant contain numeric character and also cant be empty.')
    }
    if(!validator.isAlpha(lastName) || validator.isEmpty(lastName)){
        return res.send('lastname is not valid.')
    }

    if(gender && !["male","female"].includes(gender.toLowerCase())){
        return res.send('gender should only be male or female')
    }
    if(!validator.isInt(age.toString())){
        return res.send('Age can only be numeric value')
    }

}
