const { Router } = require("express");
const { Ability } = require("../db");
const router = Router();

module.exports = router;

router.post("/", async (req, res) => {
  const { name, mana_cost } = req.body;
  if (!name || !mana_cost) {
    return res.status(404).send("Falta enviar datos obligatorios");
  }

  try {
    const newAbility = await Ability.create(req.body);
    res.status(201).json(newAbility);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.put("/setCharacter", async (req, res) => {
  const { idAbility, codeCharacter } = req.body;

  //primero lo busco por el modelo de habilidad
  const ability = await Ability.findByPk(idAbility);

  //luego le asigno el personaje con el codigo
  await ability.setCharacter(codeCharacter);

  //y lo devuelvo ya con el codigo asignado
  res.json(ability);
});
