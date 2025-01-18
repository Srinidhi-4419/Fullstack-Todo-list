import React from 'react';
import { Link } from 'react-router-dom';

const Main = () => {
  return (
    <div className='flex space-x-3 justify-around'>
      <div className='flex-col space-y-2 mt-24 items-center xs:mt-12'>
        <p className='text-[50px] font-bold xs:text-[40px] xs:pl-16'>Organize your<br></br> work and <br></br>life, finally</p>
        <p className='text-gray-400 xs:text-xl'>Simplify life for both you and your team with the</p>
        <p className='text-gray-400  xs:text-xl'> task manager and to-do list app.</p>
        <Link
          to="/signup"
          className='bg-orange-400 text-black text-2xl rounded-md pt-2 pb-2 pl-1 pr-1 mt-4 inline-block text-center xs:ml-20'
        >
          Start for free
        </Link>
      </div>
      <div className='mt-20'>
        <img
          src='https://static.vecteezy.com/system/resources/previews/011/537/898/original/task-reminder-or-todo-list-for-business-professional-for-website-landing-homepage-template-banner-isometric-free-vector.jpg'
          className='h-[400px] w-[800px] xs:hidden'
          alt="Task manager preview"
        />
      </div>
    </div>
  );
};

export default Main;
