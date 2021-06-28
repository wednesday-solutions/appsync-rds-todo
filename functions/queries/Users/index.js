import 'source-map-support/register';
/**
 *
 * Users
 *
 */
import { logHandler, success, failure } from '@utils';
import db from '@models';
import { findAll } from '@utils/dbUtils';

exports.handler = async (event, context, callback) =>
  logHandler(event, callback, async () => {
    try {
      return success(context.done || callback, await findAll(db.users, event));
    } catch (err) {
      return failure(context.fail || callback, err);
    }
  });
