import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '@utils/constants';
import db from '@models';
import _ from 'lodash';
import pluralize from 'pluralize';
import deepMapKeys from 'deep-map-keys';
import { Op } from 'sequelize';
import { getArgs } from '@utils';

export const sequelizedWhere = (currentWhere = {}, where = {}) => {
  where = deepMapKeys(where, (k) => {
    if (Op[k]) {
      return Op[k];
    }
    return k;
  });
  return { ...currentWhere, ...where };
};

const getPaginationArgs = (args) => {
  let order = [['id', 'ASC']];
  if (args?.order) {
    order = [args.order.split(':')];
  }
  return { order, limit: args?.limit || DEFAULT_LIMIT, offset: args?.offset || DEFAULT_OFFSET };
};
const recursivelyInclude = (model, event, parent = '', depth = 4, include = []) => {
  if (!model?.associations) {
    return include;
  }
  if (depth === 0) {
    return include;
  }

  Object.keys(model.associations).forEach((association) => {
    const currentNode = `${parent}${_.isEmpty(parent) ? '' : '.'}${association}`;
    const args = getArgs(event, currentNode);
    if (args.queryList[currentNode]) {
      const m = db[association] || db[pluralize(association)];
      const isList = association === pluralize(association);
      let includedModel = {
        model: m
      };

      if (isList) {
        includedModel = { ...getPaginationArgs(args.pagination), ...includedModel };
        includedModel.separate = true;
        includedModel.subQuery = false;
      }

      includedModel.include = recursivelyInclude(m, event, currentNode, depth - 1);

      include.push(includedModel);
    }
  });
  return include;
};

export const findAll = async (model, event) => {
  const { where: _, pagination, ...args } = event.arguments;
  const where = sequelizedWhere(args, event.arguments.where);
  const paginationArgs = getPaginationArgs(pagination);
  const include = recursivelyInclude(model, event);
  const itemsWithCount = await model.findAndCountAll({
    where,
    include: include || [],
    underscored: true,
    underscoredAll: true,
    ...paginationArgs,
    distinct: true
  });
  return { items: itemsWithCount.rows, pageInfo: { total: itemsWithCount.count } };
};

export const findAllRaw = async (model, where, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET, include = [], raw) =>
  await findAll(model, where, limit, offset, include, true);
