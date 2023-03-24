const catalogBatchProcess = async (event) => {
  console.log('catalogBatchProcess RUN');

  // console.log('catalogBatchProcess Lambda event.Records: ', event.Records);
  console.log('catalogBatchProcess Lambda event: ', event);
};

export const main = catalogBatchProcess;
