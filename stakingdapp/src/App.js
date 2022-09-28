import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import TokenSharpIcon from "@mui/icons-material/TokenSharp";
import { ethers } from "ethers";
import stakingABI from "./artifacts/contracts/Staking.sol/Staking.json";
import erc20ABI from "./artifacts/contracts/TokenNuke.sol/TokenNuke.json";
const contractERC20 = "0x37004FAB027B3833e6C9A56F592b4973c0950267";
const contractStaking = "0x035a12b4aCbE2b754147DeEbd468AddE82dF2269";

const App = () => {
  const [web3, setWeb3] = useState({
    provider: "",
    contract1: "",
    contract2: "",
  });
  const [stakeToken, setStakeToken] = useState("");
  const [chainID, setChainID] = useState(false);
  const [account, setAccount] = useState("");
  const [accBal, setAccBal] = useState("");
  const [nukeToken, setNukeToken] = useState("");
  const [rewardToken, setRewardToken] = useState("");

  const checkConeection = async () => {
    try {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      if (_provider) {
        await _provider.send("eth_requestAccounts", []);
        const _signer = _provider.getSigner();
        const _account = await _signer.getAddress();
        setAccount(_account);
        const _contract1 = new ethers.Contract(
          contractStaking,
          stakingABI.abi,
          _provider
        );

        const _contract2 = new ethers.Contract(
          contractERC20,
          erc20ABI.abi,
          _provider
        );
        setWeb3({
          provider: _provider,
          contract1: _contract1,
          contract2: _contract2,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const accountsChanged = () => {
      window.ethereum.on("accountsChanged", async (acc) => {
        if (acc.length === 0) console.log("please connect to accounts");
        else if (acc[0] !== account) setAccount(acc[0]);
      });
    };
    web3.provider && accountsChanged();
    web3.provider && checkBal();
    web3.provider && totalReward();
    web3.provider && totalToken();
  }, [web3.provider, account]);

  useEffect(() => {
    const checkChainID = async () => {
      if (window.ethereum) {
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        const chain = parseInt(currentChainId);
        if (chain.toString() === "5") setChainID(true);
        else setChainID(false);
      }
    };
    web3.provider && checkChainID();
  }, [web3.provider, account, chainID]);

  useEffect(() => {
    checkConeection();
  }, []);
  console.log(web3);
  const buyToken = async () => {
    const _signer = web3.provider.getSigner();
    const contractInstance1 = web3.contract1.connect(_signer);
    await contractInstance1.buyToken({
      value: ethers.utils.parseEther("0.01"),
    });
  };
  const checkBal = async () => {
    const _signer = web3.provider.getSigner();
    const contractInstance1 = web3.contract2.connect(_signer);
    const _bal = await contractInstance1.balanceOf(account);
    setAccBal(_bal.toString());
  };

  const stakingToken = async () => {
    const _signer = web3.provider.getSigner();
    const contractInstance = web3.contract1.connect(_signer);
    const contractInstance2 = web3.contract2.connect(_signer);
    const temp = await contractInstance2.approve(contractStaking, stakeToken);
    await temp.wait();
    const success = await contractInstance.stakeToken(stakeToken);
    await success.wait();
    totalToken();
  };

  const unStakingToken = async () => {
    const _signer = web3.provider.getSigner();
    const contractInstance = web3.contract1.connect(_signer);
    const success = await contractInstance.withdraw(stakeToken);
    await success.wait();
    totalToken();
  };

  const rewardCount = async () => {
    const _signer = web3.provider.getSigner();
    const contractInstance = web3.contract1.connect(_signer);
    const temp = await contractInstance.rewardCount();
    await temp.wait();
    totalReward();
  };

  const claimReward = async () => {
    const _signer = web3.provider.getSigner();
    const contractInstance = web3.contract1.connect(_signer);
    await contractInstance.claimReward();
    totalReward();
  };
  const totalReward = async () => {
    const _signer = web3.provider.getSigner();
    const contractInstance = web3.contract1.connect(_signer);
    const temp = await contractInstance.rewardAmount(account);
    setRewardToken(temp.toString());
  };
  const totalToken = async () => {
    const _signer = web3.provider.getSigner();
    const contractInstance = web3.contract1.connect(_signer);
    const temp = await contractInstance.stakingBal(account);
    setNukeToken(temp.toString());
  };
  return (
    <Box>
      {!chainID ? (
        <Alert
          variant="filled"
          severity="warning"
          sx={{ justifyContent: "center" }}
        >
          Install MetaMask Wallet, Switch to Goerli Network and Refresh the Page
          for further Options!!
        </Alert>
      ) : (
        <>
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              margin: "10px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            STAKING DAPP
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={() => checkConeection()}
              sx={{ margin: "10px auto" }}
            >
              {account ? account : "Connect Wallet"}
            </Button>
          </Box>
          <Paper
            elevation={5}
            sx={{
              width: "30%",
              m: "100px auto",
              padding: "20px",
              borderRadius: "20px",
              backgroundColor: "#BCBBBF",
            }}
          >
            <Stack
              direction="row"
              spacing={20}
              sx={{ margin: "auto", width: "400px" }}
            >
              <Stack direction="column" sx={{ textAlign: "center" }}>
                <Paper
                  elevation={10}
                  sx={{ padding: "10px", borderRadius: "20px", width:"100%" }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#272333",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".0.4rem",
                    }}
                  >
                    nukeTk Token
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#272333",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".0.4rem",
                    }}
                  >
                    {nukeToken}
                  </Typography>
                </Paper>
              </Stack>

              <Stack direction="column" sx={{ textAlign: "center" }}>
                <Paper
                  elevation={10}
                  sx={{ padding: "10px", borderRadius: "20px", width:"100%" }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#272333",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".0.4rem",
                    }}
                  >
                    Reward Token
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#272333",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".0.4rem",
                    }}
                  >
                    {rewardToken}
                  </Typography>
                </Paper>
              </Stack>
            </Stack>

            <Stack direction="column" sx={{ margin: "30px" }} spacing={2}>
              <TextField
                label="Token"
                onChange={(e) => setStakeToken(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TokenSharpIcon
                        sx={{ color: "#0288d1", margin: "5px" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" spacing={20}>
                <Stack sx={{ width: "150px" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#646F76",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".1rem",
                    }}
                  >
                    Balance:{accBal}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#646F76",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".1rem",
                    }}
                  >
                    0.01 ETH = 100 TOKEN
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => buyToken()}
                  >
                    Buy Token
                  </Button>
                </Stack>
                <Stack sx={{ width: "250px", textAlign: "center" }}>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => rewardCount()}
                    sx={{ margin: "10px auto" }}
                  >
                    CHECK REWARD
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => claimReward()}
                  >
                    CLAIM REWARD
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{
                      margin: "auto",
                      color: "#646F76",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".1rem",
                    }}
                  >
                    AFTER WITHDRAWAL OF THE TOKEN THEN ONLY THE REWARD TOKEN CAN
                    BE CLAIMED
                  </Typography>
                </Stack>
              </Stack>
              <Button variant="contained" onClick={() => stakingToken()}>
                Stake
              </Button>
              <Button variant="contained" onClick={() => unStakingToken()}>
                unStake
              </Button>
            </Stack>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default App;
