const ethers = require("ethers");
const fs = require("fs-extra")
require("dotenv").config();

async function main(){
    const provider =new ethers.JsonRpcProvider(process.env.RPC_URL)
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY,provider);
    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
    const password  = process.env.PRIVATE_KEY_PASSOWRD;
    let wallet = ethers.Wallet.fromEncryptedJsonSync(
      encryptedJson,
      password
    );
    wallet = wallet.connect(provider);
    //deploy contract
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin","utf8");
    const contractFactory = new ethers.ContractFactory(abi,binary,wallet);
    console.log("contract Deploying, please wait ...");
    const contract = await contractFactory.deploy();
    await contract.deploymentTransaction().wait(1);
    console.log(`Contract Address:${contract.target}`)
    const currentFaviriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number:${currentFaviriteNumber.toString()}`);
    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    const updateFaviriteNumber = await contract.retrieve();
    console.log(`update Favorite Number:${updateFaviriteNumber.toString()}`);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
