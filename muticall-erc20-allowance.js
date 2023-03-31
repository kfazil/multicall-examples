const multicall = require("@makerdao/multicall")
const multicallAddress = '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441';
const tokenAddress = '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5';
const ownerAddress = ''; // your wallet address
const spenderAddresses = ['']; // contract address to check if approved to access erc20 token 
const rpcUrl = "https://mainnet.infura.io/v3/your_key" // get one from https://www.infura.io/ 

run = async() => {
  try {
      const config = {
          rpcUrl: rpcUrl,
          multicallAddress: multicallAddress
      };
  
      const multicallTokensConfig = [];
      spenderAddresses.forEach(spenderAddress => {
          // will only work with erc20 token addresses
          var obj = {
              target: tokenAddress,
              call: ['allowance(address,address)(uint256)', ownerAddress, spenderAddress],
              returns: [['allowance_to_access_token_' + tokenAddress + "_from_owner_" + ownerAddress + "_to_spender_" + spenderAddress, val => val]]
          }
          multicallTokensConfig.push(obj);
      });
      
      const response = await multicall.aggregate(
          multicallTokensConfig,
          config
      );
      
      Object.keys(response.results.transformed).forEach((allowance, index) => {
          console.log(response.results.transformed[allowance].toString());
      });
    
  } catch(error){
    console.error(error.message);
  }
}

run();