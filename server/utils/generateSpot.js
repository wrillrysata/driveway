import randomstring from 'randomstring';

const generateSpot = () => {
  const spotname = `Spot ${randomstring.generate({
    length: 3,
    charset: 'alphabetic',
    capitalization: 'uppercase',
  })}`;
  return spotname;
};
export default generateSpot;
