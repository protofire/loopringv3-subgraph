import { Circuit } from "../../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";
import { blockTypes } from "../constants";

export function getOrCreateCircuit(
  id: String,
  createIfNotFound: boolean = true
): Circuit {
  let circuit = Circuit.load(id);

  if (circuit == null && createIfNotFound) {
    circuit = new Circuit(id);
  }

  return circuit as Circuit;
}

export function getCircuitId(
  blockType: i32,
  onChainDataAvailability: bool,
  blockSize: i32,
  blockVersion: i32
): String {
  let dataAvailability = onChainDataAvailability ? "true" : "false";
  let bType = BigInt.fromI32(blockType);
  let bSize = BigInt.fromI32(blockSize);
  let bVersion = BigInt.fromI32(blockVersion);
  return bType
    .toString()
    .concat("-")
    .concat(bSize.toString())
    .concat("-")
    .concat(bVersion.toString())
    .concat("-")
    .concat(dataAvailability);
}

export function getBlockType(blockType: i32): String {
  return blockTypes[blockType];
}
