export function validateOptions(
  max:number,
  windowMs:number
){

  if(max <= 0){

    throw new Error(
      "max must be greater than 0"
    );

  }


  if(windowMs <= 0){

    throw new Error(
      "windowMs must be greater than 0"
    );

  }

}