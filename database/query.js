
const getUser = async ({connection, query, params}) => {
    const [err, rows] = await connection.query(query, params);
    if(!rows || !rows.length) return null;
    return rows[0];
}
module.exports = {getUser}