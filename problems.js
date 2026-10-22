// Problem data. Edit the text here and the page updates automatically.
window.PROBLEMS = [
  {
    "n": 1,
    "title": "Boarding Pass",
    "description": [
      "A ferry company prints a ticket for every booking. Read the passenger's name, the number of seats booked, how many of those seats are student seats, and the fare per seat. Each student seat gets a 20% discount. Print the ticket exactly as shown in the sample.",
      "Gross is seats × fare. Discount 20% is the total discount on the student seats. Net is gross minus discount. The fare is always a multiple of 5, so every amount is a whole number. A label and its value are separated by one tab."
    ],
    "input": [
      "Line 1: the passenger's name, one word",
      "Line 2: the number of seats, from 1 to 20",
      "Line 3: the number of student seats, from 0 to the number of seats",
      "Line 4: the fare per seat, a multiple of 5 from 100 to 2000"
    ],
    "output": [
      "Eight lines. The first line is the ferry name inside double quotes, and the second line shows the route Tilik\\Nasugbu (with a backslash). The remaining lines are Passenger, Seats, Students, Gross, Discount 20%, and Net, in that order."
    ],
    "steps": null,
    "sampleInput": "Maria\n5\n2\n450\n",
    "sampleOutput": "\"SEA BREEZE FERRY\"\nRoute:\tTilik\\Nasugbu\nPassenger:\tMaria\nSeats:\t5\nStudents:\t2\nGross:\tPHP 2250\nDiscount 20%:\tPHP 180\nNet:\tPHP 2070\n"
  },
  {
    "n": 2,
    "title": "Arrival Clock",
    "description": [
      "A ferry leaves at a given time of day and sails for a given number of minutes. Print the departure time, the trip duration, the arrival time, and how many days after the departure day the ferry arrives. Times are in the 24-hour format and are printed as hours and minutes."
    ],
    "input": [
      "Line 1: the departure hour, from 0 to 23",
      "Line 2: the departure minute, from 0 to 59",
      "Line 3: the trip duration in minutes, from 0 to 100000"
    ],
    "output": [
      "Four lines: Departure, Duration, Arrival and Days later. Departure and Arrival are printed as hours and minutes (for example, 1 hr 55 min). The duration is shown as whole hours and the remaining minutes (the hours are not limited to 23)."
    ],
    "steps": null,
    "sampleInput": "22\n45\n190\n",
    "sampleOutput": "Departure: 22 hr 45 min\nDuration: 3 hr 10 min\nArrival: 1 hr 55 min\nDays later: 1\n"
  },
  {
    "n": 3,
    "title": "Nine-Digit Shuffle",
    "description": [
      "A registry issues a 9-digit ID number. Using only arithmetic operators, print the sum of its digits, the number written backwards, the number with its first and last digits swapped, and its middle three digits (the 4th, 5th and 6th digits from the left)."
    ],
    "input": [
      "Line 1: the ID number, from 100000000 to 999999999"
    ],
    "output": [
      "Four lines: Digit sum, Reversed, Ends swapped and Middle digits. Reversed and Ends swapped are printed as ordinary whole numbers, so leading zeros are not shown. Middle digits are printed as three separate digits with one space between them."
    ],
    "steps": null,
    "sampleInput": "123456789\n",
    "sampleOutput": "Digit sum: 45\nReversed: 987654321\nEnds swapped: 923456781\nMiddle digits: 4 5 6\n"
  },
  {
    "n": 4,
    "title": "Change Maker",
    "description": [
      "A cashier must give back an amount in the fewest bills and coins. The amount is given in centavos (100 centavos = 1 peso). The available pieces are PHP 1000, 500, 100, 50, 20, 10, 5 and 1, then 25c, 10c, 5c and 1c. Always use the largest piece possible first."
    ],
    "input": [
      "Line 1: the amount in centavos, from 1 to 99999999"
    ],
    "output": [
      "Twelve lines, one per piece in the order listed above, each showing how many of that piece are given."
    ],
    "steps": null,
    "sampleInput": "123456\n",
    "sampleOutput": "PHP 1000: 1\nPHP 500: 0\nPHP 100: 2\nPHP 50: 0\nPHP 20: 1\nPHP 10: 1\nPHP 5: 0\nPHP 1: 4\n25c: 2\n10c: 0\n5c: 1\n1c: 1\n"
  },
  {
    "n": 5,
    "title": "Triple Mystery Machine",
    "description": [
      "A machine holds three whole numbers, x, y and z. Starting from the values given, it applies the following steps in order. Division is whole-number division.",
      "Print the values of x, y and z after the ninth step."
    ],
    "input": [
      "Line 1: x, from 10 to 99",
      "Line 2: y, from 10 to 99",
      "Line 3: z, from 10 to 99"
    ],
    "output": [
      "Three lines, showing x, y and z after step 9."
    ],
    "steps": [
      "x += y",
      "y *= z",
      "z -= 7",
      "x *= z",
      "y %= x",
      "x /= 3",
      "z *= x",
      "y += z",
      "z %= 100"
    ],
    "sampleInput": "12\n30\n20\n",
    "sampleOutput": "x = 182\ny = 2420\nz = 66\n"
  },
  {
    "n": 6,
    "title": "Installment Plan",
    "description": [
      "A store sells appliances on installment. The customer pays a down payment equal to a percentage of the price, and the balance is divided equally into monthly payments. Any pesos that cannot be divided equally (the leftover) are added to the final payment.",
      "Down payment is the price times the percentage divided by 100. Balance is the price minus the down payment. Monthly payment is the balance divided by the number of months, as a whole number of pesos. Leftover is what remains after that division. Final payment is the monthly payment plus the leftover. The price is always a multiple of 100, so the down payment is always a whole number."
    ],
    "input": [
      "Line 1: the price in pesos, a multiple of 100 from 100 to 1000000",
      "Line 2: the down payment percentage, a whole number from 5 to 50",
      "Line 3: the number of months, from 1 to 60"
    ],
    "output": [
      "Five lines: Down payment, Balance, Monthly payment, Leftover and Final payment, each with its amount in pesos."
    ],
    "steps": null,
    "sampleInput": "25000\n20\n7\n",
    "sampleOutput": "Down payment: PHP 5000\nBalance: PHP 20000\nMonthly payment: PHP 2857\nLeftover: PHP 1\nFinal payment: PHP 2858\n"
  },
  {
    "n": 7,
    "title": "Floor Tiles",
    "description": [
      "A room measures a given length and width in meters, and it is covered with square tiles whose side is given in centimeters. Partial tiles must be bought whole, so the number of tiles along each side is rounded up. Then 10% extra tiles (rounded up) are added for breakage. Print the tile counts and the total cost."
    ],
    "input": [
      "Line 1: the room length in meters, from 1 to 50",
      "Line 2: the room width in meters, from 1 to 50",
      "Line 3: the side of one tile in centimeters, from 10 to 100",
      "Line 4: the price of one tile in pesos, from 1 to 1000"
    ],
    "output": [
      "Six lines: Tiles along length, Tiles along width, Tiles needed, Spare tiles (10%), Tiles to buy and Total cost. The total cost is a whole number of pesos."
    ],
    "steps": null,
    "sampleInput": "4\n3\n30\n85\n",
    "sampleOutput": "Tiles along length: 14\nTiles along width: 10\nTiles needed: 140\nSpare tiles (10%): 14\nTiles to buy: 154\nTotal cost: PHP 13090\n"
  },
  {
    "n": 8,
    "title": "Check Digit",
    "description": [
      "A water utility gives each account a 6-digit number followed by a check digit. To compute it, multiply the digits of the number from left to right by 6, 5, 4, 3, 2 and 1, and add the results. The check digit is the remainder when this sum is divided by 11."
    ],
    "input": [
      "Line 1: the account number, from 100000 to 999999"
    ],
    "output": [
      "Three lines: Weighted sum, Check digit and Full code (the account number, a hyphen, then the check digit, for example 483920-8)."
    ],
    "steps": null,
    "sampleInput": "483920\n",
    "sampleOutput": "Weighted sum: 107\nCheck digit: 8\nFull code: 483920-8\n"
  }
];
