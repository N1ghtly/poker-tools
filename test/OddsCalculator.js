import { expect } from "chai";
import CardGroup from "../src/CardGroup";
import OddsCalculator from "../src/OddsCalculator";

describe("OddsCalculator", () => {
  it("should throw exception if board has 1 or 2 cards", () => {
    const player1Cards = CardGroup.fromString("AcAh");
    const player2Cards = CardGroup.fromString("7c7h");
    let board = CardGroup.fromString("2d,Kd");

    expect(OddsCalculator.calculateEquity.bind(null, [player1Cards, player2Cards], board)).to.throw(Error, "The board must contain 0, 3, 4 or 5 cards");

    board = CardGroup.fromString("2d");

    expect(OddsCalculator.calculateEquity.bind(null, [player1Cards, player2Cards], board)).to.throw(Error, "The board must contain 0, 3, 4 or 5 cards");
  });

  it("should throw exception if there are duplicate card", () => {
    let player1Cards = CardGroup.fromString("AcAh");
    let player2Cards = CardGroup.fromString("AcAd");
    let board = CardGroup.fromString("2d,Kd,4s");

    expect(OddsCalculator.calculateEquity.bind(null, [player1Cards, player2Cards], board)).to.throw(Error, "Detected duplicate cards");

    player1Cards = CardGroup.fromString("AcAh");
    player2Cards = CardGroup.fromString("3d,4d");
    board = CardGroup.fromString("2d,Kd,Ac");

    expect(OddsCalculator.calculateEquity.bind(null, [player1Cards, player2Cards], board)).to.throw(Error, "Detected duplicate cards");
  });

  it("full board", () => {
    const player1Cards = CardGroup.fromString("5d6d");
    const player2Cards = CardGroup.fromString("4h4c");
    const board = CardGroup.fromString("3d,4d,7d,4s,Ts");
    const result = OddsCalculator.calculateEquity([player1Cards, player2Cards], board);

    expect(result.equities[0].getEquity()).to.equal(100);
    expect(result.equities[1].getEquity()).to.equal(0);
  });

  it("one card left", () => {
    let player1Cards = CardGroup.fromString("AsKc"); // 4 queens / 44 cards left
    let player2Cards = CardGroup.fromString("AdAh");
    let board = CardGroup.fromString("2d,Jd,Tc,4s");
    let result = OddsCalculator.calculateEquity([player1Cards, player2Cards], board);

    expect(result.equities[0].getEquity()).to.equal(9);
    expect(result.equities[1].getEquity()).to.equal(91);

    player1Cards = CardGroup.fromString("AsKc"); // 2 queens + 3 kings + 3 aces / 44 cards left
    player2Cards = CardGroup.fromString("QcQh");
    board = CardGroup.fromString("2d,Jd,Tc,4s");
    result = OddsCalculator.calculateEquity([player1Cards, player2Cards], board);

    expect(result.equities[0].getEquity()).to.equal(18);
    expect(result.equities[1].getEquity()).to.equal(82);

    player1Cards = CardGroup.fromString("Ad5d"); // 9 diamonds + 2 fives / 44 cards left
    player2Cards = CardGroup.fromString("AhJh");
    board = CardGroup.fromString("2d,Jd,5c,Ts");
    result = OddsCalculator.calculateEquity([player1Cards, player2Cards], board);

    expect(result.equities[0].getEquity()).to.equal(25);
    expect(result.equities[1].getEquity()).to.equal(75);

    player1Cards = CardGroup.fromString("Kd3d");
    player2Cards = CardGroup.fromString("5c5h");
    board = CardGroup.fromString("Ad,4d,5d,5s");
    result = OddsCalculator.calculateEquity([player1Cards, player2Cards], board);

    expect(result.equities[0].getEquity()).to.equal(2);
    expect(result.equities[1].getEquity()).to.equal(98);
  });

  it("two cards left", () => {
    let player1Cards = CardGroup.fromString("AsKc");
    let player2Cards = CardGroup.fromString("AdAh");
    let board = CardGroup.fromString("2d,Kd,8c");
    let result = OddsCalculator.calculateEquity([player1Cards, player2Cards], board);

    expect(result.equities[0].getEquity()).to.equal(9);
    expect(result.equities[1].getEquity()).to.equal(91);

    player1Cards = CardGroup.fromString("Kd3d");
    player2Cards = CardGroup.fromString("5c5h");
    board = CardGroup.fromString("Ad,4d,5d");
    result = OddsCalculator.calculateEquity([player1Cards, player2Cards], board);

    expect(result.equities[0].getEquity()).to.equal(67);
    expect(result.equities[1].getEquity()).to.equal(33);
  });

  it("winner", () => {
    const player1Cards = CardGroup.fromString("JhJs");
    const player2Cards = CardGroup.fromString("JdQc");
    const board = CardGroup.fromString("7s9sTs");

    const result = OddsCalculator.calculateWinner([player1Cards, player2Cards], board);
    console.log(result[0]);
  });

  it("winner 2", () => {
    const player1Cards = CardGroup.fromString("JhJs");
    const player2Cards = CardGroup.fromString("JdJc");
    const board = CardGroup.fromString("7s9sTs");

    const result = OddsCalculator.calculateWinner([player1Cards, player2Cards], board);
  });

  it("winner 3", () => {
    const player1Cards = CardGroup.fromString("QhQs");
    const player2Cards = CardGroup.fromString("JdQc");
    const player3Cards = CardGroup.fromString("JdQc");
    const board = CardGroup.fromString("7s9sTs");

    const result = OddsCalculator.calculateWinner([player1Cards, player2Cards, player3Cards], board);
  });

  it("winner omaha", () => {
    const player1Cards = CardGroup.fromString("QhQs7d8d");
    const player2Cards = CardGroup.fromString("JdQc9h8c");
    const board = CardGroup.fromString("7sJsTsKhAs");

    const result = OddsCalculator.calculateWinner([player1Cards, player2Cards], board, true);
    console.log(JSON.stringify(result, null, 2));
  });

  it("no board", () => {
    const player1Cards = CardGroup.fromString("AcAh");
    const player2Cards = CardGroup.fromString("7c7h");
    const result = OddsCalculator.calculateEquity([player1Cards, player2Cards], null, 10000);

    const oddsPlayer1 = result.equities[0].getEquity();
    const oddsPlayer2 = result.equities[1].getEquity();

    // aces are roughly a 80-20 favorite
    expect(oddsPlayer1).to.be.above(75);
    expect(oddsPlayer1).to.be.below(85);

    expect(oddsPlayer2).to.be.above(15);
    expect(oddsPlayer2).to.be.below(25);
  });
});
