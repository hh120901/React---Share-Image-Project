import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline} from 'react-icons/md';
import {Link, useParams} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import {client, urlFor} from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ( {user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment ] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();
  const addComment = ()=>{
    if(comment){
      setAddingComment(true)

      client 
        .patch(pinId)
        .setIfMissing({comments: []})
        .insert('after','comments[-1]',[{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(()=>{
          fecthPinDetails();
          setComment('');
          setAddingComment(false);
        })
    }
  }

  const fecthPinDetails = ()=>{
    let query = pinDetailQuery(pinId);

    if(query){
      client.fetch(query)
        .then((data)=>{
          setPinDetail(data[0]);
          
          if(data[0]){
            query = pinDetailMorePinQuery(data[0]);

            client.fetch(query)
              .then((res)=> setPins(res))
          }
        })
    }
  }

  useEffect(() => {
    fecthPinDetails();
  }, [pinId])

  if(!pinDetail) return <Spinner message="Loading Pin..."/>
  
  return (
    <>
      <div
        className="flex xl-flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).width(350).url()}
            alt="user-post"
            className="rounded-t-3xl rounded-b-lg"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image.asset.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white flex w-9 h-9 rounded-full items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              href={pinDetail.destination} 
              target="_blank"
              rel='noreferrer'
            >
              {pinDetail.destination}
            </a>
          </div>
          
          <div>
            <h1 className='text-4xl font-bold break-words mt-3'>
              Post Title: {pinDetail.title}
            </h1>
            <p className='mt-3'>About: {pinDetail.about}</p>
          </div>
            <Link to={`user-profile/${pinDetail.postedBy?._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
              <img 
                className='w-10 h-10 rounded-full object-cover'
                src={pinDetail.postedBy?.image}
                alt ="user-profile"
              />
              <p className='flex font-semibold capitalize'> {pinDetail.postedBy?.userName}</p>
            </Link>

          <hr className='font-3xl text-red-500 mt-3'/>
          <h2 className='mt-5 text-xl font-bold'> ALL Comments</h2>
          <div className='max-h-370 overflow-y-auto'>
            {pinDetail?.comments?.map((comment,i)=>(
                <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                  <img 
                    src={comment.postedBy.image}
                    alt="user-profile"
                    className='w-5 h-5 rounded-full cursor-pointer'
                  />
                  <div className='flex flex-col'>
                    <p className='font-bold'>{comment.postedBy.userName}</p>
                    <p>{comment.comment}</p>
                  </div>

                </div>
            ))} 
              
          </div>
          <div className='flex flex-wrap mt-6 gap-3'>
            <Link to={`user-profile/${user._id}`} className="flex gap-2 mt-1 items-center bg-white rounded-lg">
              <img 
                className='w-6 h-6 rounded-full cursor-pointer'
                src={user.image}
                alt ="user-profile"
              />
              <p className='flex font-semibold capitalize'> {user.userName}</p>
            </Link>
            <input
              className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-500'
              type="text"
              placeholder='Add a comment'
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
            />
            <button
              type='button'
              className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={addComment}
            >
              {addingComment ? 'Posting the comment... ': 'Post'}
            </button>
          </div>
        </div>
      </div>
      {console.log(pins)}
      {pins?.length > 0 ? (
        <>
          <h2 className='text-center font-bole text-2x mt-8 mb-4'>
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ): (
        <>
          <div className='flex my-3'>

          </div>
          <Spinner message="Loading more pins... "></Spinner>
        </>
      )}
    </>
  );
}

export default PinDetail