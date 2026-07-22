const { RideParticipant,User, Post} = require("../models");

exports.create = async (data) => {
  return await RideParticipant.create(data);
};

exports.findByPostAndUser = async (postId, userId) => {
  return await RideParticipant.findOne({
    where: {
      post_id: postId,
      user_id: userId,
    },
  });
};

exports.findAllByPost = async (postId) => {
  return await RideParticipant.findAll({
    where: {
      post_id: postId,
    },
    include: [
      {
        model: User,
        as: "participant",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

exports.findById = async(id)=>{

 return await RideParticipant.findByPk(id);

};

exports.countAccepted = async(postId)=>{

 return await RideParticipant.count({

  where:{
    post_id:postId,
    status:"ACCEPTED"
  }

 });
};

exports.updateStatus = async(
 id,
 status
)=>{

 await RideParticipant.update(
 {
   status
 },
 {
   where:{
     id
   }
 });


 return await RideParticipant.findByPk(id);

};

exports.findByUserId = async(userId)=>{

 return await RideParticipant.findAll({

  where:{
    user_id:userId,
  },

  include:[
    {
      model:Post,
      as:"post"
    }
  ],

  order:[
    ["created_at","DESC"]
  ]

 });

};

exports.delete = async (id) => {
  return await RideParticipant.destroy({
    where: {
      id,
    },
  });
};
