import { CircuitRegistered, CircuitDisabled } from "../../generated/BlockVerifier/BlockVerifier";
import { getOrCreateCircuit, getCircuitId, getBlockType } from "../utils/helpers";

// - event: CircuitRegistered(indexed uint8,bool,uint16,uint8)
//   handler: handleCircuitRegistered

export function handleCircuitRegistered(event: CircuitRegistered): void {
  let circuitId = getCircuitId(
    event.params.blockType,
    event.params.onchainDataAvailability,
    event.params.blockSize,
    event.params.blockVersion
  );
  let circuit = getOrCreateCircuit(circuitId);

  circuit.blockType = getBlockType(event.params.blockType);
  circuit.blockTypeRaw = event.params.blockType;
  circuit.onchainDataAvailability = event.params.onchainDataAvailability;
  circuit.blockSize = event.params.blockSize;
  circuit.blockVersion = event.params.blockVersion;
  circuit.enabled = true;

  circuit.save();
}

// - event: CircuitDisabled(indexed uint8,bool,uint16,uint8)
//   handler: handleCircuitDisabled

export function handleCircuitDisabled(event: CircuitDisabled): void {
  let circuitId = getCircuitId(
    event.params.blockType,
    event.params.onchainDataAvailability,
    event.params.blockSize,
    event.params.blockVersion
  );
  let circuit = getOrCreateCircuit(circuitId);

  circuit.enabled = false;

  circuit.save();
}
