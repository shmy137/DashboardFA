import React from 'react';
import EditParticipantForm from './_components/edit-participant-form';

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <EditParticipantForm id={params.id} />
    </div>
  );
};

export default Page;
