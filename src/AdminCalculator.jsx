import { getSupply, getTokenPrice } from "./api";
import { useState, useEffect } from "react";
import { Button, Input, Select } from "antd";
const { Option } = Select;

const options = ["wblur stake", "LP stake", "burst Lock"];

function Admin() {
  const [data, setData] = useState(0);
  const [Burstamount, setBurstAmount] = useState(0);
  const [BHPamount, setBHPAmount] = useState(0);
  const [address, setAddress] = useState();
  const [type, setType] = useState("wBlurStake");
  const [tokenPrice, setTokenPrice] = useState();
  const [apr, setApr] = useState(0);
  const burstPrice = tokenPrice
    ? tokenPrice[
        "0x0535a470f39DEc973C15D2Aa6E7f968235F6e1D4".toLowerCase()
      ]?.toFixed(4)
    : 0;
  const BHPPrice = tokenPrice
    ? tokenPrice[
        "0x4F101364378Ca48ec4bcB17D35aAfbD7ad93c022".toLowerCase()
      ]?.toFixed(4)
    : 0;
  const calculate = () => {
    const burstPrice =
      tokenPrice["0x0535a470f39DEc973C15D2Aa6E7f968235F6e1D4".toLowerCase()];
    const BHPPrice =
      tokenPrice["0x4F101364378Ca48ec4bcB17D35aAfbD7ad93c022".toLowerCase()];
    const LPPrice =
      tokenPrice["0xEa542D518Ce4E6633Bbf697b089ecDEfe0A97dA6".toLowerCase()];
    const wBlurPrice =
      tokenPrice["0x72CebE61e70142b4B4720087aBb723182e4ca6e8".toLowerCase()];

    const totalValue =
      BHPPrice * Number(BHPamount) + Number(Burstamount) * burstPrice;
    let supplyValue;
    if (type === "wBlurStake") {
      supplyValue = data * wBlurPrice;
    }
    if (type === "LPStake") {
      supplyValue = data * LPPrice;
    }
    if (type === "lock") {
      supplyValue = data * burstPrice;
    }
    setApr((totalValue / supplyValue / 7) * 365);
  };
  async function getData() {
    const param = {};
    console.log(type);
    if (type === "lock") {
      param.type = "lock";
    } else param.type = "stake";
    if (type === "lock") {
      param.addr = import.meta.env.VITE_BURST_LOCKER;
    }
    if (type === "wBlurStake") {
      param.addr = import.meta.env.VITE_WBLUR_STAKING;
    }
    if (type === "LPStake") {
      param.addr = "0x3eEaE34A7Db2B5F04eFF48249EE640dc3F581a7f";
    }
    try {
      const res = await getSupply(param);
      setData(res.total_supply);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, [type]);

  let price;
  if (tokenPrice) {
    const LPPrice =
      tokenPrice["0xEa542D518Ce4E6633Bbf697b089ecDEfe0A97dA6".toLowerCase()];
    const wBlurPrice =
      tokenPrice["0x72CebE61e70142b4B4720087aBb723182e4ca6e8".toLowerCase()];
    let supplyValue;
    if (type === "wBlurStake") {
      price = wBlurPrice;
    }
    if (type === "LPStake") {
      price = LPPrice;
    }
    if (type === "lock") {
      price = burstPrice;
    }
  } else price = 0;
  if (type === "wBlurStake")
    useEffect(() => {
      async function getPrice() {
        try {
          const res = await getTokenPrice();
          Object.keys(res).forEach((key) => {
            res[key.toLowerCase()] = res[key];
          });
          setTokenPrice(res);
        } catch (error) {
          console.log(error);
        }
      }
      getPrice();
    }, []);

  const handleChange = (e) => {
    setType(e);
  };
  return (
    <div
      style={{
        padding: "1rem",
        height: "100vh",
        background: "#fff",
        color: "#000",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        reward Type
        <Select
          value={type}
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: "wBlurStake", label: "wBlur Stake" },
            { value: "LPStake", label: "LP Stake" },
            { value: "lock", label: "Burst Lock" },
          ]}
        />
        <span>{`Supply: ${data}    Price: ${price}`}</span>
      </div>
      <div>
        Burst Amount
        <Input
          style={{ width: "400px", marginBottom: "2rem" }}
          value={Burstamount}
          onChange={(e) => setBurstAmount(e.target.value)}
        ></Input>
        Price:{burstPrice}
      </div>
      <div>
        BHP Amount
        <Input
          style={{ width: "400px", marginBottom: "2rem" }}
          value={BHPamount}
          onChange={(e) => setBHPAmount(e.target.value)}
        ></Input>
        Price:{BHPPrice}
      </div>
      <Button
        style={{ marginBottom: "2rem" }}
        onClick={() => {
          calculate();
        }}
      >
        calculate Apr
      </Button>
      <div>apr: {apr}</div>
    </div>
  );
}

export default Admin;
