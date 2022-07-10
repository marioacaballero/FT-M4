const { Router } = require("express");
const { Op, Character, Role } = require("../db");
const router = Router();

module.exports = router;

router.post("/", async (req, res) => {
  const { code, name, hp, mana } = req.body;

  if (!code || !name || !hp || !mana) {
    return res.status(404).send("Falta enviar datos obligatorios");
  }
  try {
    const newCharacter = await Character.create(req.body);
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(404).send("Error en alguno de los datos provistos");
  }
});

router.get("/", async (req, res) => {
  const { race, age } = req.query;
  const condition = {};
  const where = {};

  // if (race && age) {
  //   const characters = await Character.findAll({
  //     where: {
  //       [Op.and]: [{ race: { [Op.eq]: race } }, { age: { [Op.eq]: age } }],
  //     },
  //   });
  //   return res.json(characters);
  // }

  if (race) {
    where.race = race;
  }
  if (age) {
    where.age = age;
  }

  condition.where = where;
  const characters = await Character.findAll(condition);
  res.json(characters);
});

router.get("/young", async (req, res) => {
  const characters = await Character.findAll({
    where: {
      age: { [Op.lt]: 25 },
    },
  });

  // if (!characters) {
  //   return res
  //     .status(201)
  //     .json({ msg: "There is 0 characters lower than 25 years old" });
  // }

  res.json(characters);
});

router.get("/roles/:code", async (req, res) => {
  const { code } = req.params;

  const character = await Character.findByPk(code, {
    include: Role,
  });

  res.json(character);
});

router.get("/:code", async (req, res) => {
  const { code } = req.params;
  const character = await Character.findByPk(code);

  if (!character) {
    return res
      .status(404)
      .send(`El código ${code} no corresponde a un personaje existente`);
  }

  res.json(character);
});

router.put("/addAbilities", async (req, res) => {
  const { abilities, codeCharacter } = req.body;

  const character = await Character.findByPk(codeCharacter);

  //como las habilidades no estan en la base de datos las tengo que crear

  const abilitiesCreadas = abilities.map((ab) => character.createAbility(ab));

  // como el map de una promesa me devuelve un arreglo de promesas tengo que esperar a que todas se resuelvan.

  await Promise.all(abilitiesCreadas);
  res.send("Personajes actualizados");
});

router.put("/:attribute", async (req, res) => {
  const { attribute } = req.params;
  const { value } = req.query;

  await Character.update(
    {
      [attribute]: value,
    },
    {
      where: { [attribute]: { [Op.is]: null } },
    }
  );

  res.send("Personajes actualizados");
});
