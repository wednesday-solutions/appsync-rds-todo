import 'source-map-support/register';
/**
 *
 * Lists
 *
 */
import { logHandler, success, failure } from '@utils';
import db from '@models';
import { findAll } from '@utils/dbUtils';

exports.handler = async (event, context, callback) =>
  logHandler(event, callback, async () => {
    try {
      const lists = await findAll(db.lists, event);
      console.log(JSON.stringify(lists));
      return success(context.done || callback, lists);
    } catch (err) {
      return failure(context.fail || callback, err);
    }
  });
