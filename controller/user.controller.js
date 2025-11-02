const registerUser = async(req , res) => {
    res.send("Registered");
};


const loginUser = async(req , res) => {
    res.send("Logged In");
};

export {registerUser}  
export {loginUser} 