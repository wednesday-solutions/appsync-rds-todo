// import get from "lodash/get";
import gql from 'graphql-tag';
import { Kind, print } from 'graphql/language';

const get = (a) => a;
export const failure = (callback, error) => {
  console.log('failure', error);
  return callback(get(error, 'message', 'Something went wrong. Please contact support@appsync_rds_todo.com'));
};

export const success = (callback, data) => {
  console.log('success', JSON.stringify(data));
  return callback(null, data);
};

export const getArgs = (event, key, base) => {
  if (!key) {
    key = event.field || event?.info?.fieldName;
  }
  if (!key) {
    return {};
  }
  const args = { where: {} };
  let queries = {};
  if (key) {
    const { pagination, queryList, ...rest } = getCurrentArguments(event, key, base);
    args.pagination = pagination;
    queries = queryList;
    args.where = { ...args.where, ...rest };
  }
  args.where = { ...args.where, ...args.where?.filter };
  delete args.where?.filter;
  // eslint-disable-next-line
  return { ...args, queryList: queries };
};
export const logHandler = (event, lambdaCallback, cb) => {
  console.log({ event: JSON.stringify(event) });
  if (event?.source === 'serverless-plugin-warmup') {
    console.log('WarmUp - Lambda is warm!');
    return lambdaCallback(null, 'Lambda is warm!');
  }
  return cb(getArgs(event, '', true));
};

function parseObject(typeName, ast, variables) {
  const value = {};
  ast.fields.forEach((field) => {
    value[field.name.value] = parseLiteral(field.value, field.value, variables);
  });

  return value;
}

function parseLiteral(typeName, ast, variables) {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(typeName, ast, variables);
    case Kind.LIST:
      return ast.values.map((n) => parseLiteral(typeName, n, variables));
    case Kind.NULL:
      return null;
    case Kind.VARIABLE:
      return variables ? variables[ast.name.value] : undefined;
    default:
      throw new TypeError(`${typeName} cannot represent value: ${print(ast)}`);
  }
}

export const convertToMap = (argArr, variables = {}) => {
  const args = {};
  argArr.forEach((arg) => {
    if (arg.value.kind === 'Variable') {
      args[arg.name.value] = variables[arg.value.name.value];
    } else if (arg.value.kind === 'IntValue') {
      args[arg.name.value] = parseInt(arg.value.value, 10);
    } else if (arg.value.kind === 'ObjectValue') {
      args[arg.name.value] = parseObject(Kind.OBJECT, arg.value, variables);
    } else {
      args[arg.name.value] = arg.value.value;
    }
  });
  return args;
};
export const getCurrentArguments = (event, fieldName = '', base) => {
  // handle for queryList[mealsTypes.meals]
  fieldName = fieldName.includes('.') ? fieldName.split('.')[fieldName.split('.').length - 1] : fieldName;

  let args = { ...(base ? event.arguments : null), queryList: {} };
  const addSelectionSet = (selection, parent) => {
    if (selection.selectionSet?.selections?.length) {
      const fieldName = parent ? `${parent}.${selection.name.value}` : selection.name.value;
      args.queryList[fieldName] = [];
      selection.selectionSet.selections.forEach((s) => {
        args.queryList[fieldName].push(s.name.value);
        addSelectionSet(s, fieldName);
      });
    }
  };
  const context = event.ctx;
  const typeName = (event.typeName || 'Query').toLowerCase();
  let selectionSetGraphQL = event.selectionSetGraphQL || '';
  const pos = selectionSetGraphQL.indexOf('})');
  if (pos >= 0) {
    selectionSetGraphQL = selectionSetGraphQL.substr(pos + 3);
  }
  let operation;
  try {
    operation = gql`
      ${typeName}
      ${event.field}
      ${selectionSetGraphQL}
    `;
  } catch (err) {
    operation = gql`
      ${typeName}
      ${event.field}
      ${event.selectionSetGraphQL}
    `;
  }
  const iterateSelectionsRecursively = (selections) => {
    selections.forEach((selection) => {
      args.queryList[selection.name.value] = [];
      if (selection.kind === 'Field' && selection.name?.value === fieldName && selection.arguments?.length) {
        args = { ...args, ...convertToMap(selection.arguments, context?.info?.variables) };
      } else if (selection.selectionSet?.selections) {
        iterateSelectionsRecursively(selection.selectionSet.selections);
      }
      addSelectionSet(selection, null);
    });
  };
  iterateSelectionsRecursively(operation.definitions[0].selectionSet.selections);
  if (args.pagination?.offset && typeof args.pagination?.offset === 'string') {
    args.pagination.offset = parseInt(args.pagination.offset, 10);
  }

  if (args.pagination?.limit && typeof args.pagination?.limit === 'string') {
    args.pagination.limit = parseInt(args.pagination.limit, 10);
  }

  args.queryList = mapKeysDeep(args.queryList, (i) => {
    if (i.match(/\.items\./)) {
      i = i.replace(/\.items\./, '.');
    }
    if (i.match(/\bitems\./)) {
      i = i.replace(/\bitems\./, '');
    }
    return i;
  });
  return args;
};

export const mapKeysDeep = (obj, fn) =>
  Array.isArray(obj)
    ? obj.map((val) => mapKeysDeep(val, fn))
    : typeof obj === 'object'
    ? Object.keys(obj).reduce((acc, current) => {
        const key = fn(current);
        const val = obj[current];
        acc[key] = val !== null && typeof val === 'object' ? mapKeysDeep(val, fn) : val;
        return acc;
      }, obj)
    : obj;
