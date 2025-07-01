import init, { prove_program } from 'miden-wasm';

onmessage = async function (e) {
  const { code, inputs } = e.data;

  try {
    await init();

    const {
      program_hash,
      cycles,
      stack_output,
      trace_len,
      proof
    } = prove_program(code, inputs);

    // Helper to convert BigInt to number safely
    const bigintToNumber = (x) =>
      typeof x === 'bigint' ? Number(x) : x;

    // Ensure stack_output is a standard array with numbers
    const formattedStackOutput = Array.from(stack_output ?? []).map(bigintToNumber);

    const outputObj = {
      stack_output: formattedStackOutput,
      trace_len: trace_len
    };

    postMessage({
      success: true,
      result: {
        programInfo: {
          program_hash,
          cycles,
          trace_len
        },
        output: JSON.stringify(outputObj, null, 2),
        proof,
        stackOutput: formattedStackOutput.toString()
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    postMessage({ success: false, error: errorMessage });
  }
};
