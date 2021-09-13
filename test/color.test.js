const Color = artifacts.require('./Color.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()
contract('Color', (accounts) => {
  let contract;
  before(async () => {
    contract = await Color.deployed();
  })
  describe('Developement', async () => {
    it('deploys successfully', async () => {
      const address = contract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    })

    it('has a name', async () => {
      const name = await contract.name();
      // assert.equal(name, "Color");
      assert.equal(name, "Color");
    })

    it('has a symbloe', async () => {
      const name = await contract.symbol();
      assert.equal(name, "COLOR");
    })
  })

  describe("Minting", async () => {

    it("create a new token success", async () => {
      const result = await contract.mint('#ASDFGH');
      const totalSupply = await contract.totalSupply();

      // success
      assert.equal(totalSupply, 1);
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0]);

      // fails
      await contract.mint('#ASDFGH').should.be.rejected
    })
  })

  describe("Indexing", async () => {
    it("lists colors", async () => {
      // generating three token
      await contract.mint('#FFFFFF')
      await contract.mint('#000000')
      await contract.mint('#101010')
      const totalSupply = await contract.totalSupply()
      let color
      let result = []
      for (let i = 1; i <= totalSupply; i++) {
        color = await contract.colors(i - 1);
        result.push(color);
      }
      let expected = ['#ASDFGH', '#FFFFFF', '#000000', '#101010'];
      assert.equal(result.join(','), expected.join(','))
    })
  })
})