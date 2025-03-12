import React from 'react';

const ProjectDetails = () => {
  return (
    <div className="project-details">
      <section className="details-section scttl">
        <h2>Project Overview</h2>
        <p>
        This project addresses the crucial task of Alzheimer's Disease classification using deep learning techniques. By leveraging a diverse dataset comprising four classes – Non-Demented, Very Mild Demented, Mild Demented, and Moderate Demented – our study evaluates CNN-based models to accurately diagnose different stages of Alzheimer's.
        </p>
        
        <h3>Research Significance</h3>
        <p>
        Alzheimer's Disease is the most common form of dementia, affecting millions worldwide. Early detection is critical for effective management and intervention. This research focuses on using CNNs to improve diagnostic accuracy and enable earlier intervention, potentially improving patient outcomes.
        </p>
        
        <h3>Technical Approach</h3>
        <p>
        Our system employs Convolutional Neural Networks (CNNs) trained on a dataset of MRI brain scans resized to 128×128 pixels. The study evaluates CNN architectures, including ResNet50, to classify Alzheimer's stages with high accuracy and consistent performance metrics.
        </p>
        
      </section>
    </div>
  );
};

export default ProjectDetails;