import moment from 'moment';

import uuidv4 from 'uuidv4';

import db from '../db/index';

import Validate from '../helpers/utils';

moment.suppressDeprecationWarnings = true;
const meetupsController = {
	// Create a meetup
	async postAMeetup(req, res) {
		const createQuery = `insert into
          meetups(m_id, topic, images, location, createdon, happeningon, createdby)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          returning *`;
		const values = [
			uuidv4(),
			req.body.topic,
			req.body.images,
			req.body.location,
			moment(new Date()),
			moment(new Date()),
			req.body.createdby
		];
		try {
			const { rows } = await db.query(createQuery, values);
			return res.status(200).send(rows[0]);
		} catch(error) {
			return res.status(400).send(error.message);
		}
	},
	// Get all meetups
	async getAllMeetups(req, res) {
		const createQuery = 'select * from meetups';

		try {
			const { rows } = await db.query(createQuery);

			return res.status(201).send(rows);
		} catch(error) {
			return res.status(400).send(error.message);
		}
	},	
	// Get a specific meetup
	async getAMeetup(req, res) {
		const { id } = req.params;
		const createQuery = `select * from meetups where m_id='${id}'`;

		try {
			const { rows } = await db.query(createQuery);

			return res.status(201).send(rows);
		} catch(error) {
			return res.status(400).json({ error: error.message });
		}
	},
	// Update a meetup
	async updateAMeetup(req, res) {
		const createQuery = 'update meetups set topic=$1, images=$2, location=$3, ' +
			'happeningon=$4 where m_id=$5 returning *';

		const values = [
			req.body.topic,
			req.body.images,
			req.body.location,
			moment(new Date()),
			req.params.id
		];
		try {
			const { rows } = await db.query(createQuery, values);
			const validate = Validate._validateMeetup;
			const {error} = validate(req.body);
			if(error) {
				const {details} = error;
				const messages = [];
				details.forEach(detail => {
					messages.push(detail.message);
				});
				return res.status(400).send({
					status: 400,
					error: messages
				});
			}
			return res.status(200).send(rows[0]);
		} catch(error) {
			return res.status(400).send(error.message);
		}
	},
	// Delete a meetup
	async deleteAMeetup(req, res) {
		const { id } = req.params;
		const createQuery = `delete from meetups where m_id='${id}' returning *`;

		try {
			const { rows } = await db.query(createQuery);

			return res.status(200).send(rows);
		} catch(error) {
			return res.status(400).json({ error: error.message });
		}
	}
};
export default meetupsController;