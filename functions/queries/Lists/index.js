import 'source-map-support/register';
/**
 *
 * Lists
 *
 */
import { logHandler } from '@utils';
import db from '@models';
import { findAll } from '@utils/dbUtils';

exports.handler = async (event, context, callback) =>
  logHandler(event, callback, async () => {
    try {
      return callback(null, await findAll(db.lists, event));
    } catch (err) {
      return callback(err, null);
    }
  });
