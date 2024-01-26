const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
};

describe('Escrow', () => {
    it('saves the address', async () => {
        const RealEstate = await ethers.getContractFactory('RealEstate');
        const realEstate = await RealEstate.deploy();

        await realEstate.deployed();

        console.log('RealEstate Contract Address:', realEstate.address);
    });
});