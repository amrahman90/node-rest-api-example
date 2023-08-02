import { RequestHandler } from "express";

import { DrumContainer } from "../models/drumcontainer";

export const createDrumContainer: RequestHandler = async (req, res, next) => {
  var drumcontainers = await DrumContainer.create({ ...req.body });
  return res
    .status(200)
    .json({ message: "drumContainer created successfully", data: drumcontainers });
};

export const deleteDrumContainer: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const deleteddrumcontainer: DrumContainer | null = await DrumContainer.findByPk(id);

  await DrumContainer.destroy({ where: { DrumContainerId:id } });

  return res
    .status(200)
    .json({ message: "Drumcontainer deleted successfully", data: deleteddrumcontainer });
};

export const getAllDrumContainer: RequestHandler = async (req, res, next) => {
  const alldrumContainers: DrumContainer[] = await DrumContainer.findAll();

  return res
    .status(200)
    .json({ message: "DrumContainers fetched successfully", data: alldrumContainers });
};

export const getDrumContaineryId: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const drumcontainer: DrumContainer | null = await DrumContainer.findByPk(id);
  return res
    .status(200)
    .json({ message: "Record fetched successfully", data: drumcontainer });
};

export const updateDrumContainer: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  await DrumContainer.update({ ...req.body }, { where: { DrumContainerId:id } });
  const updatedDrumContainer: DrumContainer | null = await DrumContainer.findByPk(id);
  return res
    .status(200)
    .json({ message: "DrumContainer updated successfully", data: updatedDrumContainer });
};
