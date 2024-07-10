import bcrypt from "bcryptjs";

export const saltAndHashPassword = async(password: string):Promise<string>=>{
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPasword = await bcrypt.hash(password, salt);
    console.log(hashedPasword);
    return hashedPasword;

}

export const comparePassword = async(password:string, hashedPasword: string):Promise<boolean>=>{
    return await bcrypt.compare(password, hashedPasword);
}