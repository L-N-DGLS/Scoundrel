/*
==============================
   PSEUDO CODE
==============================

Start of Turn:
    1. Check if ROOM has 4 cards.
      - If not, draw from DUNGEON until ROOM has 4.
      - Reset:
          potionUsedThisRoom = false
          actionTakenThisRoom = false  ← to block running after acting

Player chooses ONE of the following actions:
    A. SELECT CARD
    B. FIGHT BAREHANDED
    C. RUN (only if ranLastRoom == false AND actionTakenThisRoom == false)


    A. SELECT CARD:

      - Player selects one of the 4 ROOM cards:
        = Weapon (Diamond):
            - Equip weapon in weapon slot.
            - Reset lastBeatenMonsterValue.
            - potionUsedThisRoom = false.
            - ranLastRoom = false.
            - actionTakenThisRoom = true.
            - Discard old weapon (and its beaten monsters).

        = Potion (Heart):
            - If potionUsedThisRoom == false:
                  Apply healing to player HP.
                  potionUsedThisRoom = true.
              Else:
                  Discard potion immediately.
            - ranLastRoom = false.
            - actionTakenThisRoom = true.

        = Monster (Club/Spade):
            - If player has weapon equipped:
                  - If weapon is fresh OR monster.value <= lastBeatenMonsterValue:
                        weapon.value -= monster.value
                        lastBeatenMonsterValue = monster.value
                  - Else:
                        damage = monster.value - weapon.value
                        HP -= damage
                  - Discard monster after battle.
            - If no weapon equipped:
                  - HP -= monster.value (barehanded default)
                  - Discard monster.
            - ranLastRoom = false.
            - actionTakenThisRoom = true.

    B. FIGHT BAREHANDED:

      - Player ignores any equipped weapon.
      - Choose a monster from the ROOM to fight barehanded.
      - HP -= monster.value.
      - Discard the chosen monster.
      - ranLastRoom = false.
      - actionTakenThisRoom = true.


    C. RUN:

      Only allowed if:
          ranLastRoom == false
          AND actionTakenThisRoom == false.
      - Shuffle all current ROOM cards.
      - Push them to the bottom of DUNGEON.
      - Clear ROOM completely.
      - Draw 4 new cards from DUNGEON.
      - potionUsedThisRoom = false.
      - ranLastRoom = true.
      - actionTakenThisRoom = false.


End of Turn:

  1. If ROOM has ≤ 1 card:
       - Draw from DUNGEON until ROOM = 4 cards. If DUNGEON.length(<=2) - Game Won.
       - potionUsedThisRoom = false.
       - ranLastRoom = false.
       - actionTakenThisRoom = false.

  2. Check Player HP:
       - If HP ≤ 0 - Game Over.



CARD TYPE LOGIC

- Monster: Clubs & Spades (2–14)
- Weapon: Diamonds (2–10)
- Potion: Hearts (2–10)
- Red face cards & red aces removed
- No Jokers

  FLAGS SUMMARY

- potionUsedThisRoom (Boolean): Prevents more than 1 potion per room.
- lastBeatenMonsterValue (Integer): Tracks last monster defeated with weapon.
- ranLastRoom (Boolean): Prevents consecutive runs.
- actionTakenThisRoom (Boolean): Prevents running after any action in the current room.
*/

let potionUsedThisRoom = false;
let lastBeatenMonsterValue = 0;
let ranLastRoom = false;
let actionTakenThisRoom = false;

  //GameState management with NgRx

const GameState = {

  DUNGEON: [

    // Clubs - Monsters
    { id: 'C2', suit: 'Clubs', value: 2, type: 'monster' },
    { id: 'C3', suit: 'Clubs', value: 3, type: 'monster' },
    { id: 'C4', suit: 'Clubs', value: 4, type: 'monster' },
    { id: 'C5', suit: 'Clubs', value: 5, type: 'monster' },
    { id: 'C6', suit: 'Clubs', value: 6, type: 'monster' },
    { id: 'C7', suit: 'Clubs', value: 7, type: 'monster' },
    { id: 'C8', suit: 'Clubs', value: 8, type: 'monster' },
    { id: 'C9', suit: 'Clubs', value: 9, type: 'monster' },
    { id: 'C10',suit: 'Clubs', value: 10, type: 'monster'},
    { id: 'CJ', suit: 'Clubs', value: 11, type: 'monster'},
    { id: 'CQ', suit: 'Clubs', value: 12, type: 'monster'},
    { id: 'CK', suit: 'Clubs', value: 13, type: 'monster'},
    { id: 'CA', suit: 'Clubs', value: 14, type: 'monster'},

    // Spades - Monsters
    { id: 'S2', suit: 'Spades', value: 2, type: 'monster' },
    { id: 'S3', suit: 'Spades', value: 3, type: 'monster' },
    { id: 'S4', suit: 'Spades', value: 4, type: 'monster' },
    { id: 'S5', suit: 'Spades', value: 5, type: 'monster' },
    { id: 'S6', suit: 'Spades', value: 6, type: 'monster' },
    { id: 'S7', suit: 'Spades', value: 7, type: 'monster' },
    { id: 'S8', suit: 'Spades', value: 8, type: 'monster' },
    { id: 'S9', suit: 'Spades', value: 9, type: 'monster' },
    { id: 'S10',suit: 'Spades', value: 10, type: 'monster'},
    { id: 'SJ', suit: 'Spades', value: 11, type: 'monster'},
    { id: 'SQ', suit: 'Spades', value: 12, type: 'monster'},
    { id: 'SK', suit: 'Spades', value: 13, type: 'monster'},
    { id: 'SA', suit: 'Spades', value: 14, type: 'monster'},

    // Diamonds - Weapons
    { id: 'D2', suit: 'Diamonds', value: 2, type: 'weapon' },
    { id: 'D3', suit: 'Diamonds', value: 3, type: 'weapon' },
    { id: 'D4', suit: 'Diamonds', value: 4, type: 'weapon' },
    { id: 'D5', suit: 'Diamonds', value: 5, type: 'weapon' },
    { id: 'D6', suit: 'Diamonds', value: 6, type: 'weapon' },
    { id: 'D7', suit: 'Diamonds', value: 7, type: 'weapon' },
    { id: 'D8', suit: 'Diamonds', value: 8, type: 'weapon' },
    { id: 'D9', suit: 'Diamonds', value: 9, type: 'weapon' },
    { id: 'D10',suit: 'Diamonds', value: 10,type: 'weapon' },

    // Hearts - Potions
    { id: 'H2', suit: 'Hearts', value: 2, type: 'potion' },
    { id: 'H3', suit: 'Hearts', value: 3, type: 'potion' },
    { id: 'H4', suit: 'Hearts', value: 4, type: 'potion' },
    { id: 'H5', suit: 'Hearts', value: 5, type: 'potion' },
    { id: 'H6', suit: 'Hearts', value: 6, type: 'potion' },
    { id: 'H7', suit: 'Hearts', value: 7, type: 'potion' },
    { id: 'H8', suit: 'Hearts', value: 8, type: 'potion' },
    { id: 'H9', suit: 'Hearts', value: 9, type: 'potion' },
    { id: 'H10',suit: 'Hearts', value: 10,type: 'potion' }
    ],
  
  ROOM: [],
  
  SLOT: [],
  
  DUNGEON_DEAD: []
}

