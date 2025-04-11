import { Any } from '../global.d';

export const convertToOptions = <T extends { [key: string]: Any }[]>(
  data: T,
  fieldValue: { label: string; value: string }
) => {
  return data.map((e) => {
    return {
      label: e[fieldValue.label],
      value: e[fieldValue.value]
    };
  });
};
