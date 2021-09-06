import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import Color from '../abis/Color.json'

class App extends Component {
  componentWillMount() {
    this.loadWeb3();
    this.loadBlockChainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      // await ethereum.request({method: 'eth_requestAccounts'});
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
  }

  async loadBlockChainData() {
    const web3 = window.web3
    let accounts = await web3.eth.personal.getAccounts()
    this.setState({account: accounts[0]});
    const networkId = await web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if (networkData) {
      // loading the contract
      const abi = Color.abi;
      const address = networkData.address;
      const myContract = new web3.eth.Contract(abi, address)
      this.setState({contract: myContract});

      // loading the total colors count
      const totalColor = await myContract.methods.totalSupply().call()
      this.setState({totalSupply: totalColor})

      // loading the colors
      for (let i = 1; i <= totalColor; i++) {
        const color = await myContract.methods.colors(i - 1).call()

        // it removes the previous array and generates new array
        // add the new color and assign to the colors state variable
        this.setState({
          colors: [...this.state.colors, color]
        })
      }

      console.log(this.state.colors);

    } else {
      alert("Smart contract not deployed to detected network.")
    }
  }

  mint = (color) => {
    this.state
      .contract
      .methods
      .mint(color)
      .send({from: this.state.account})
      .once('receipt', (receipt) => {
        this.setState({
          colors: [...this.state.colors.color]
        })
      })
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "Account goes here",
      contract: null,
      totalSupply: 0,
      colors: [],
    }
  }

  render() {
    return (
      <div className={"container"}>
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nft App
            </a>
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-block">
                <small className=" text-white">
                  <span id="account">{this.state.account}</span>
                </small>
              </li>
            </ul>
          </nav>
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                  {/* Form goes here */}
                  <h1>Issue Token</h1>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const color = this.color.value
                    this.mint(color)
                  }}>
                    <input
                      type='text'
                      className='form-control mb-1'
                      placeholder='e.g. #FFFFFF'
                      ref={(input) => {
                        this.color = input
                      }}
                    />
                    <input
                      type='submit'
                      className='btn btn-block btn-primary'
                      value='MINT'
                    />
                  </form>
                  {/*<form onSubmit={(e) => {*/}
                  {/*  e.preventDefault();*/}
                  {/*  const color = this.color.value*/}
                  {/*  this.mint(color)*/}
                  {/*}}>*/}
                  {/*  <input type={"text"} className="form-control mb-1" placeholder="eg #987das"/>*/}
                  {/*  <button type="submit" className="btn btn-block btn-primary">Mint</button>*/}
                  {/*</form>*/}
                </div>
              </main>
            </div>
            <div className="row text-center">
              {this.state.colors.map((color, key) => {
                return (
                  <div key={key} className="col-md-3 mb-3">
                    <div className="token" style={{backgroundColor: color}}></div>
                    <div>{color}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
