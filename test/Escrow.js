const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
};

describe('Escrow', () => {
    let buyer, seller, inspector, lender;
    let realEstate, escrow;

    beforeEach(async () => {
        [buyer, seller, inspector, lender] = await ethers.getSigners()

        const RealEstate = await ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deploy();
        await realEstate.deployed();

        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/1.png")
        await transaction.wait()

        const Escrow =  await ethers.getContractFactory('Escrow');
        escrow = await Escrow.deploy(realEstate.address, seller.address, inspector.address, lender.address);

        transaction = await realEstate.connect(seller).approve(escrow.address, 1);
        await transaction.wait();

        transaction = await escrow.connect(seller).list(1 );
        await transaction.wait();
    })

    describe('Deployment', () => {

        it('Returns NFT Address', async () => {
            const result = await escrow.nftAddress();
            expect(result).to.equal(realEstate.address);
        })

        it('Returns Seller Address', async () => {
            const result = await escrow.seller();
            expect(result).to.equal(seller.address);
        })

        it('Returns Inspector Address', async () => {
            const result = await escrow.inspector();
            expect(result).to.equal(inspector.address);
        })

        it('Returns lender Address', async () => {
            const result = await escrow.lender();
            expect(result).to.equal(lender.address);
        })

    })

    describe('Listing', () => {

        it('Updates Owenrship', async () => {
            expect(await realEstate.ownerOf(1)).to.equal(escrow.address);
        })

    })

});