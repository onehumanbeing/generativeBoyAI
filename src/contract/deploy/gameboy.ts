import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    await deploy('Gameboy', {
        from: deployer,
        log: true,
        autoMine: true,
        args: ["0xaea0f96f05edc0ab9d96Ba9Eeb5dc6F450B531fc"]
    });
};
module.exports = func;
func.tags = ['Gameboy'];