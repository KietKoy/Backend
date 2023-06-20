const express = require('express')
const { verifyToken, getUserIdByToken, adminAuthentication } = require('../helpers/JwtHelper');
const pollRouter = express.Router()
const knexConnection = require('../database/knexConnection')
pollRouter.post('/create', verifyToken, adminAuthentication, async (req, res, next) => {
    try {
        const { voteTitle, voteQuestion, options } = req.body;
        const poll = {
            voteTitle,
            voteQuestion,
            createdAt: new Date(Date.now()),
            createBy: req.user.id,
        }
        const checkExistsPoll = await db.first().from('polls').where('voteTitle', voteTitle);
        if (checkExistsPoll) {
            return res.status(400).json({
                message: 'Poll already exists'
            });
        }
        await db.insert(poll).into('polls');

        await Promise.all(options.map(async (option) => {
            const voteOption = {
                voteOption: option.voteOption,
                count: option.count,
                voteId: option.voteId
            };
            await db.insert(voteOption).into('options');
        }));

        return res.status(200).json({
            message: 'Create poll successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
})
pollRouter.delete('/delete/:id', verifyToken, adminAuthentication, async (req, res, next) => {
    try {
        const pollId = req.params.id;
        const checkExistingPoll = await db("polls").where("id", pollId).first();
        if (!checkExistingPoll) {
            return res.status(404).json({
                message: "Poll not found",
            });
        }

        await db("options").where("pollId", pollId).del();

        await db("polls").where("id", pollId).del();

        return res.status(200).json({
            message: "Poll deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
})
pollRouter.get("/:id", verifyToken, async (req, res) => {
    try {
        const pollId = req.params.id;

        const poll = await db("polls").where("id", pollId).first();
        if (!poll) {
            return res.status(404).json({
                message: "Poll not found",
            });
        }
        const options = await db("options").where("pollId", pollId);

        const pollDetails = {
            id: poll.id,
            voteTitle: poll.voteTitle,
            voteQuestion: poll.voteQuestion,
            createdBy: poll.createdBy,
            options: options.map((option) => ({
                id: option.id,
                voteOption: option.voteOption,
                count: option.count,
            })),
        };

        return res.status(200).json(pollDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});
pollRouter.put("/:id", verifyToken, adminAuthentication, async (req, res, next) => {
    const id = req.params.id;
    const { voteTitle, voteQuestion } = req.body;

    const updatedPoll = {
        voteTitle: voteTitle,
        voteQuestion: voteQuestion
    };

    try {
        const checkExistingPoll = await db('polls').where('id', id).first();
        if (!checkExistingPoll) {
            return res.status(404).json({ message: 'Poll not found' });
        }
        await db('polls').where('id', id).update(updatedPoll);

        res.status(200).json({ message: 'Poll updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
pollRouter.put("/options/:id", verifyToken, async (req, res, next) => {
    try {
        const optionId = req.params.optionId;
        const voteOption = req.body;
        const checkExistingOption = await db('options').where('id', optionId).first();
        if (!checkExistingOption) {
            return res.status(404).json({
                message: 'Option not found',
            });
        }
        await db('options').where('id', optionId).update({
            voteOption: voteOption,
        });
        return res.status(200).json({
            message: 'Option updated successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
});

pollRouter.post("/:pollId/options/:optionId/submit", verifyToken, async (req, res, next) => {
    try {
        const { pollId, optionId } = req.params;;

        const poll = await db("polls").where("id", pollId).first();
        if (!poll) {
            return res.status(404).json({
                message: "Poll not found",
            });
        }
        const option = await db("options").where("id", optionId).first();
        if (!option) {
            return res.status(404).json({
                message: "Option not found",
            });
        }
        await db("options")
            .where("id", optionId)
            .increment("count", 1);

        return res.status(200).json({
            message: "Option submitted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

pollRouter.post(":id/options/:optionId/unsubmit", verifyToken, async (req, res) => {
    try {
        const { pollId, optionId } = req.params;

        const poll = await db("polls").where("id", pollId).first();
        if (!poll) {
            return res.status(404).json({
                message: "Poll not found",
            });
        }
        const option = await db("options").where("id", optionId).first();
        if (!option) {
            return res.status(404).json({
                message: "Option not found",
            });
        }
        if (option.count > 0) {
            await db("options").where("id", optionId).decrement("count", 1);
        }
        return res.status(200).json({
            message: "Option unsubmitted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});
module.exports = pollRouter