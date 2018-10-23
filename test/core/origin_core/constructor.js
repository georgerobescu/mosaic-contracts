// Copyright 2018 OpenST Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------------------------------------------------------
// Test: constructor.js
//
// http://www.simpletoken.org/
//
// ----------------------------------------------------------------------------

const web3 = require('../../test_lib/web3.js');
const Utils = require('../../test_lib/utils.js');

const OriginCore = artifacts.require('OriginCore');

contract('Constructor Origin core', async (accounts) => {


    let originCore;
    let auxiliaryCoreIdentifier = web3.utils.sha3("1"),
         gas, transactionRoot, ost = accounts[0],
         initialValidators = [accounts[1], accounts[2]],
         validatorsWeights = [10, 20];

    beforeEach(async () => {

        ost = accounts[0]
             , gas = 1000
             , transactionRoot = web3.utils.sha3("1");
    });

    it('should be able to deploy Origin core', async function () {


        originCore = await OriginCore.new(
             auxiliaryCoreIdentifier,
             ost,
             initialValidators,
             validatorsWeights,
             gas,
             transactionRoot
        );

        assert(web3.utils.isAddress(originCore.address));
    });

    it('should deploy stake contract on Origin core deployment', async function () {

        originCore = await OriginCore.new(
             auxiliaryCoreIdentifier,
             ost,
             initialValidators,
             validatorsWeights,
             gas,
             transactionRoot
        );

        assert(web3.utils.isAddress(originCore.address));

        let stakeAddress = await originCore.stake.call();

        assert(web3.utils.isAddress(stakeAddress));
    });

    it('should report genesis block on Origin core deployment', async function () {

        originCore = await OriginCore.new(
             auxiliaryCoreIdentifier,
             ost,
             initialValidators,
             validatorsWeights,
             gas,
             transactionRoot
        );

        assert(web3.utils.isAddress(originCore.address));

        let head = await originCore.head.call();

        assert(head !== '0x0000000000000000000000000000000000000000000000000000000000000000');
    });

    it('should not deploy origin core if transaction root is zero', async function () {

        transactionRoot = "0x0000000000000000000000000000000000000000000000000000000000000000";
        await Utils.expectThrow(
             OriginCore.new(
                  auxiliaryCoreIdentifier,
                  ost,
                  initialValidators,
                  validatorsWeights,
                  gas,
                  transactionRoot
             )
        );
    });

    it('should not deploy origin core if ost token root is zero', async function () {

        ost = 0;

        await Utils.expectThrow(
             OriginCore.new(
                  auxiliaryCoreIdentifier,
                  ost,
                  initialValidators,
                  validatorsWeights,
                  gas,
                  transactionRoot
             )
        );
    });
});
